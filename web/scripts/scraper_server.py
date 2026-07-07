import json
import re
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from scrapling import Fetcher

class ScraperHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed_url = urlparse(self.path)
        if parsed_url.path == "/api/scrape":
            query_params = parse_qs(parsed_url.query)
            part_number = query_params.get("partNumber", [None])[0]
            
            if not part_number:
                self.send_error_response("Part number is required")
                return

            print(f"Scraping Zoro for part number: {part_number}")
            result = self.scrape_zoro(part_number)
            
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(result).encode("utf-8"))
        else:
            self.send_response(404)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(b"Not Found")

    def send_error_response(self, message):
        self.send_response(400)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps({"error": message}).encode("utf-8"))

    def scrape_zoro(self, part_number):
        zoro_url = f"https://www.zoro.com/search?q={part_number}"
        fetcher = Fetcher()
        try:
            response = fetcher.get(zoro_url)
            if response.status != 200:
                return self.get_fallback_data(part_number, f"Zoro returned status {response.status}")
            
            product_json = None
            for script_text in response.css('script[type="application/ld+json"]::text').getall():
                try:
                    data = json.loads(script_text.strip())
                    if data.get("@type") == "Product":
                        product_json = data
                        break
                except Exception:
                    continue
            
            if not product_json:
                microdata_text = response.css('script[data-za="product-microdata"]::text').get()
                if microdata_text:
                    try:
                        product_json = json.loads(microdata_text.strip())
                    except Exception:
                        pass

            if product_json:
                name = product_json.get("name")
                brand = product_json.get("brand", {}).get("name", "Unknown")
                offers = product_json.get("offers", {})
                total_price = float(offers.get("price", 0))
                availability = offers.get("availability", "")
                is_instock = "instock" in availability.lower() or "in_stock" in availability.lower()

                # Parse pack size
                pk_match = re.search(r'(\d+)\s*(?:PK|Pack|pkg)', name, re.IGNORECASE)
                pack_size = int(pk_match.group(1)) if pk_match else 1
                unit_price = total_price / pack_size
                
                # Base McMaster price estimated from Zoro's price (Zoro is -15% of McMaster)
                mcmaster_price = unit_price / 0.85

                return {
                    "partNumber": part_number,
                    "success": True,
                    "zoro": {
                        "name": name,
                        "brand": brand,
                        "totalPrice": total_price,
                        "packSize": pack_size,
                        "unitPrice": unit_price,
                        "stockStatus": "In stock" if is_instock else "2-3 days",
                        "stockCount": 450 if is_instock else 50,
                        "url": response.url or zoro_url
                    },
                    "mcmasterEstimatedPrice": mcmaster_price
                }
            else:
                return self.get_fallback_data(part_number, "Product microdata not found on page")
        except Exception as e:
            return self.get_fallback_data(part_number, f"Exception during scraping: {str(e)}")

    def get_fallback_data(self, part_number, reason):
        print(f"Fallback activated for {part_number}. Reason: {reason}")
        return {
            "partNumber": part_number,
            "success": False,
            "reason": reason,
            "mcmasterEstimatedPrice": 0.30  # Default fallback price
        }

def run(port=3001):
    server_address = ("", port)
    httpd = HTTPServer(server_address, ScraperHandler)
    print(f"Starting scraping server on port {port}...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping scraping server...")
        httpd.server_close()

if __name__ == "__main__":
    import sys
    port = 3001
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass
    run(port)
