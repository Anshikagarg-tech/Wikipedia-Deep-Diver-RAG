from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI(title="Wikipedia Deep-Driver RAG API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.get("/api/hello")
def hello():
    return {"message": "Wikipedia Deep-Driver RAG API is running"}

@app.get("/api/wiki")
def search_wikipedia(q: str):
    response = requests.get(
        "https://en.wikipedia.org/w/api.php",
        params={
            "action": "query",
            "list": "search",
            "srsearch": q,
            "format": "json",
        },
        timeout=15,
    )
    response.raise_for_status()
    return response.json()