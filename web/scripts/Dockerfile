# PartSource Zoro pricing micro-service.
# Runs the Python scraper as a long-lived service on Fly.io / Render / any
# container host. The static frontend (GitHub Pages) calls this via CORS.
#
# Build context = repo root. Build with:
#   docker build -f web/scripts/Dockerfile -t partsource-scraper .
FROM python:3.12-slim

# Playwright (scrapling runtime dep) needs system browser libraries.
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
        libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
        libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 \
        libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python deps first for layer caching.
COPY web/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt \
    && scrapling install \
    && playwright install chromium

COPY web/scripts/scraper_server.py ./scraper_server.py

# Render / Fly inject PORT. Default keeps localhost parity.
ENV PORT=3001
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD curl -fsS http://localhost:${PORT:-3001}/health || exit 1

CMD ["python", "scraper_server.py"]
