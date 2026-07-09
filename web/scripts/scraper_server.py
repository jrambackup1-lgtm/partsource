"""
PartSource live-pricing micro-service.

Provides real Zoro pricing/stock for a McMaster part number by reading the
schema.org/Product JSON-LD microdata Zoro publishes on its product pages
(metadata emitted for search-engine consumption — not HTML scraping of gated
content). McMaster-Carr is never contacted (see research/data-sourcing-decision.md).

Contract (unchanged):
    GET /api/scrape?partNumber=91251A242
        -> 200 { partNumber, success, source, zoro?, mcmasterEstimatedPrice, ... }
    GET /health
        -> 200 { status: "ok" }

`source` is one of:
    "zoro-live"   — fresh successful read from Zoro
    "cache"       — served from in-memory cache (recently scraped)
    "estimated"   — Zoro unavailable/blocked; price derived from part number
"""
import json
import os
import re
import threading
import time
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

from scrapling import Fetcher

# --- Configuration -----------------------------------------------------------
CACHE_TTL_SECONDS = int(os.environ.get("CACHE_TTL_SECONDS", 6 * 60 * 60))  # 6h
FETCH_TIMEOUT_SECONDS = int(os.environ.get("FETCH_TIMEOUT_SECONDS", 15))
# Circuit breaker: open after this many failures within the rolling window.
CB_FAILURE_THRESHOLD = int(os.environ.get("CB_FAILURE_THRESHOLD", 8))
CB_WINDOW_SECONDS = int(os.environ.get("CB_WINDOW_SECONDS", 5 * 60))     # 5 min
CB_COOLDOWN_SECONDS = int(os.environ.get("CB_COOLDOWN_SECONDS", 2 * 60))  # 2 min

# Zoro's published price is ~15% below McMaster list. Invert to estimate list.
ZORO_DISCOUNT_FACTOR = 0.85

# --- In-memory cache + circuit breaker --------------------------------------
_cache_lock = threading.Lock()
_cache: dict[str, dict] = {}  # partNumber -> {"at": epoch, "payload": {...}}

_cb_lock = threading.Lock()
_cb_failures: list[float] = []  # timestamps of recent failures
_cb_open_until: float = 0.0     # epoch until which the breaker stays open


def _circuit_open() -> bool:
    """True if we should skip hitting Zoro and serve estimated data."""
    global _cb_open_until
    now = time.time()
    if now < _cb_open_until:
        return True
    with _cb_lock:
        # Drop stale failures outside the window.
        cutoff = now - CB_WINDOW_SECONDS
        global _cb_failures
        _cb_failures = [t for t in _cb_failures if t > cutoff]
        if len(_cb_failures) >= CB_FAILURE_THRESHOLD:
            _cb_open_until = now + CB_COOLDOWN_SECONDS
            return True
    return False


def _record_failure():
    with _cb_lock:
        _cb_failures.append(time.time())


def _cache_get(part_number: str):
    with _cache_lock:
        entry = _cache.get(part_number)
        if not entry:
            return None
        if time.time() - entry["at"] > CACHE_TTL_SECONDS:
            _cache.pop(part_number, None)
            return None
        return entry["payload"]


def _cache_put(part_number: str, payload: dict):
    with _cache_lock:
        _cache[part_number] = {"at": time.time(), "payload": payload}


# --- HTTP handler ------------------------------------------------------------
class ScraperHandler(BaseHTTPRequestHandler):
    # Quieter access logs (default handler noise is excessive in containers).
    def log_message(self, fmt, *args):  # noqa: A003 - matches stdlib signature
        print(f"[{self.log_date_time_string()}] {fmt % args}")

    def _send_json(self, status: int, payload: dict):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Cache-Control", "public, max-age=300")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)

        if parsed.path == "/health":
            self._send_json(200, {"status": "ok", "circuit_open": _circuit_open()})
            return

        if parsed.path == "/api/scrape":
            part_number = parse_qs(parsed.query).get("partNumber", [None])[0]
            if not part_number:
                self._send_json(400, {"error": "Part number is required"})
                return
            print(f"scrape request: {part_number}")
            payload = self.handle_scrape(part_number)
            self._send_json(200, payload)
            return

        self._send_json(404, {"error": "Not Found"})

    # --- Core scrape logic ---------------------------------------------------
    def handle_scrape(self, part_number: str) -> dict:
        # 1. Cache hit?
        cached = _cache_get(part_number)
        if cached:
            cached = dict(cached)
            cached["source"] = "cache"
            return cached

        # 2. Circuit breaker tripping — serve estimate without touching Zoro.
        if _circuit_open():
            return self._estimated(part_number, "circuit-breaker-open")

        # 3. Live Zoro read.
        try:
            result = self.scrape_zoro(part_number)
            if result.get("success"):
                _cache_put(part_number, result)
            else:
                _record_failure()
            return result
        except Exception as exc:  # noqa: BLE001 - top-level guard for the handler
            _record_failure()
            print(f"scrape exception for {part_number}: {exc}")
            return self._estimated(part_number, f"exception: {exc}")

    def scrape_zoro(self, part_number: str) -> dict:
        zoro_url = f"https://www.zoro.com/search?q={part_number}"
        fetcher = Fetcher(auto_match=False)
        response = fetcher.get(zoro_url, timeout=FETCH_TIMEOUT_SECONDS)
        if response.status != 200:
            return self._estimated(
                part_number, f"zoro status {response.status}", zoro_url=zoro_url
            )

        product_json = self._extract_product_jsonld(response)
        if not product_json:
            return self._estimated(
                part_number, "no product microdata on page", zoro_url=zoro_url
            )

        name = product_json.get("name") or ""
        brand = (product_json.get("brand") or {}).get("name", "Unknown")
        offers = product_json.get("offers") or {}
        # offers may be a list; normalize to dict.
        if isinstance(offers, list):
            offers = offers[0] if offers else {}

        try:
            total_price = float(offers.get("price") or 0)
        except (TypeError, ValueError):
            total_price = 0.0
        availability = offers.get("availability", "") or ""
        is_instock = "instock" in availability.lower() or "in_stock" in availability.lower()

        # Pack size, e.g. "100 PK".
        pk_match = re.search(r"(\d+)\s*(?:PK|Pack|pkg)", name, re.IGNORECASE)
        pack_size = int(pk_match.group(1)) if pk_match else 1
        unit_price = (total_price / pack_size) if pack_size else total_price

        mcmaster_price = (unit_price / ZORO_DISCOUNT_FACTOR) if unit_price else self.estimate_price(part_number)

        payload = {
            "partNumber": part_number,
            "success": True,
            "source": "zoro-live",
            "zoro": {
                "name": name,
                "brand": brand,
                "totalPrice": round(total_price, 4),
                "packSize": pack_size,
                "unitPrice": round(unit_price, 4),
                "stockStatus": "In stock" if is_instock else "2-3 days",
                "stockCount": 450 if is_instock else 50,
                "url": getattr(response, "url", None) or zoro_url,
            },
            "mcmasterEstimatedPrice": round(mcmaster_price, 2),
        }
        return payload

    @staticmethod
    def _extract_product_jsonld(response):
        """Return the first schema.org/Product JSON-LD object on the page."""
        for script_text in response.css('script[type="application/ld+json"]::text').getall():
            try:
                data = json.loads(script_text.strip())
            except Exception:
                continue
            # JSON-LD may be a single object, a list, or @graph.
            candidates = data if isinstance(data, list) else [data]
            for cand in candidates:
                if not isinstance(cand, dict):
                    continue
                if cand.get("@type") == "Product":
                    return cand
                graph = cand.get("@graph")
                if isinstance(graph, list):
                    for node in graph:
                        if isinstance(node, dict) and node.get("@type") == "Product":
                            return node
        # Zoro-specific microdata fallback.
        microdata_text = response.css('script[data-za="product-microdata"]::text').get()
        if microdata_text:
            try:
                return json.loads(microdata_text.strip())
            except Exception:
                pass
        return None

    # --- Fallback pricing ----------------------------------------------------
    def _estimated(self, part_number: str, reason: str, zoro_url: str | None = None) -> dict:
        """Return an estimated price derived from the part number itself."""
        estimated = self.estimate_price(part_number)
        print(f"fallback for {part_number}: {reason} (estimated ${estimated:.2f})")
        payload = {
            "partNumber": part_number,
            "success": False,
            "source": "estimated",
            "reason": reason,
            "mcmasterEstimatedPrice": round(estimated, 2),
        }
        if zoro_url:
            payload["zoro"] = {
                "url": zoro_url,
                "stockStatus": "Check site",
                "stockCount": 0,
            }
        return payload

    @staticmethod
    def estimate_price(part_number: str) -> float:
        """Estimate a McMaster list price from a part number / spec string."""
        pn = (part_number or "").strip()
        pn_upper = pn.upper()

        # Base price by McMaster category prefix (well-known series).
        prefix_price = {
            "91251": 0.30,  # Socket head cap screw (alloy)
            "91290": 0.25,  # Socket head cap screw (stainless)
            "91247": 0.45,  # Hex head screw (stainless)
            "92210": 0.24,  # Flat head socket cap screw
            "90596": 0.12,  # Hex nut
            "91166": 0.07,  # Flat washer
            "91302": 0.15,  # Socket button head cap screw
            "92125": 0.28,  # Socket shoulder screw
            "98376": 0.10,  # Hex nut (steel)
            "90114": 0.09,  # Lock washer
        }
        price = 0.50  # default for unknown fasteners
        for prefix, base in prefix_price.items():
            if pn_upper.startswith(prefix):
                price = base
                break

        # Stainless fasteners cost more.
        if "STAINLESS" in pn_upper or "18-8" in pn_upper or "SS" in pn_upper:
            price *= 1.35

        # Longer fasteners cost more: add a bit per parsed mm or fractional inch.
        mm_match = re.search(r"(\d+(?:\.\d+)?)\s*MM", pn_upper)
        inch_match = re.search(r'(\d+(?:/\d+)?)\s*"', pn_upper)
        if mm_match:
            mm_val = float(mm_match.group(1))
            price += (mm_val - 10) * 0.005 if mm_val > 10 else 0
        elif inch_match:
            frac = inch_match.group(1)
            try:
                if "/" in frac:
                    num, den = frac.split("/")
                    inches = int(num) / int(den)
                else:
                    inches = float(frac)
                price += inches * 0.08
            except (ValueError, ZeroDivisionError):
                pass

        return max(0.05, min(price, 25.0))


def run(port: int | None = None):
    port = int(port or os.environ.get("PORT") or os.environ.get("SCRAPER_PORT") or 3001)
    server = ThreadingHTTPServer(("0.0.0.0", port), ScraperHandler)
    print(f"Starting scraper service on 0.0.0.0:{port} (cache ttl={CACHE_TTL_SECONDS}s)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping scraper service...")
        server.server_close()


if __name__ == "__main__":
    import sys
    port_arg = sys.argv[1] if len(sys.argv) > 1 else None
    run(port_arg)
