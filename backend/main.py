import os

import requests
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Wikipedia Deep-Driver RAG API")

# Comma-separated list of allowed origins, e.g. "https://myapp.com,http://localhost:5173"
ALLOWED_ORIGINS = os.getenv(
    "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in ALLOWED_ORIGINS],
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

WIKI_API = "https://en.wikipedia.org/w/api.php"
HEADERS = {"User-Agent": "DeepDriverRAG/1.0 (Wikipedia search demo)"}


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/hello")
def hello():
    return {"message": "Wikipedia Deep-Driver RAG API is running"}


@app.get("/api/wiki")
def search_wikipedia(
    q: str = Query(..., min_length=1, max_length=300),
    limit: int = Query(6, ge=1, le=10),
):
    """Search Wikipedia and return articles shaped for the frontend:
    {"articles": [{"title", "summary", "url", "thumbnail"}]}
    """
    try:
        response = requests.get(
            WIKI_API,
            params={
                "action": "query",
                "format": "json",
                "formatversion": 2,
                "generator": "search",
                "gsrsearch": q,
                "gsrlimit": limit,
                "prop": "extracts|info|pageimages",
                "exintro": 1,
                "explaintext": 1,
                "exsentences": 4,
                "exlimit": "max",
                "inprop": "url",
                "piprop": "thumbnail",
                "pithumbsize": 240,
                "pilimit": "max",
            },
            headers=HEADERS,
            timeout=15,
        )
        response.raise_for_status()
    except requests.RequestException:
        raise HTTPException(status_code=502, detail="Could not reach Wikipedia.")

    pages = response.json().get("query", {}).get("pages", [])
    pages.sort(key=lambda page: page.get("index", 0))  # keep search relevance order

    articles = [
        {
            "title": page.get("title", "Untitled"),
            "summary": (page.get("extract") or "").strip(),
            "url": page.get("fullurl")
            or f"https://en.wikipedia.org/?curid={page.get('pageid')}",
            "thumbnail": (page.get("thumbnail") or {}).get("source"),
        }
        for page in pages
    ]
    return {"articles": articles}
