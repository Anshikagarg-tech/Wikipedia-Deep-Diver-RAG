# DeepDriver AI — Wikipedia Deep Diver

Search Wikipedia and explore article summaries with a responsive, light/dark UI.

## Run

```bash
# Backend
cd backend && pip install -r requirements.txt
uvicorn main:app --reload          # http://127.0.0.1:8000

# Frontend
cd frontend && npm install && npm run dev   # http://localhost:5173
```

Optional config: `VITE_API_URL` (frontend API base URL), `CORS_ORIGINS` (backend, comma-separated).
