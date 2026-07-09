# Local Scrapling Scraper Setup Plan

This plan outlines how to configure a local Scrapling-based McMaster-Carr scraper on a home/residential IP (e.g., Raspberry Pi or local PC) to bypass cloud firewall blocks.

---

## 1. Technical Stack

*   **Scraper Library:** `scrapling` (stealth browser automation built on Playwright with anti-fingerprinting).
*   **API Framework:** `FastAPI` + `uvicorn` (lightweight async Python API).
*   **Exposure Tunnel:** `cloudflared` (Cloudflare Tunnels) or `Tailscale Funnel` (free, secure HTTPS public URL).

---

## 2. Setup Steps

### Step 1: Install Dependencies
On the local machine/Raspberry Pi:
```bash
pip install scrapling fastapi uvicorn playwright
playwright install chromium
```

### Step 2: Implement the Local Scraper Server
Create `local_scraper.py` on the local machine:
```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from scrapling import Fetcher
import uvicorn

app = FastAPI()

# Allow CORS so your frontend can call this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/scrape")
def scrape_part(part_number: str):
    url = f"https://www.mcmaster.com/{part_number}/"
    
    # Scrapling stealth fetcher
    fetcher = Fetcher(auto_match=True)
    try:
        response = fetcher.get(url)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch page")
        
        # Parse price and title from HTML using CSS selectors
        # (McMaster uses data-mcm-part-number or specific classes)
        price_element = response.css('[data-mcm-price]::text').first()
        title_element = response.css('h1::text').first()
        
        if not price_element:
            # Fallback selectors
            price_element = response.xpath("//span[contains(@class, 'price')]/text()").first()

        return {
            "part_number": part_number,
            "title": title_element.strip() if title_element else "Unknown Part",
            "price": price_element.strip() if price_element else None,
            "source": "scrapling-local"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### Step 3: Expose via Cloudflare Tunnel (or ngrok)
1. Install `cloudflared` on the Pi/PC.
2. Run tunnel pointing to the local FastAPI port:
   ```bash
   cloudflared tunnel --url http://localhost:8000
   ```
3. Copy the generated public URL (e.g., `https://random-subdomain.trycloudflare.com`).

### Step 4: Configure Frontend
Set the `VITE_SCRAPER_URL` environment variable during the frontend build to point to the tunnel URL.

---

## 3. Risks & Considerations

*   **Pros:**
    *   Bypasses Akamai's cloud IP blacklists by utilizing a residential IP.
    *   No login required for guest price checks.
*   **Cons:**
    *   Requires local hardware (PC or Pi) to be continuously online.
    *   Residential IPs can still get blocked if request velocity is too high (rate-limiting).
