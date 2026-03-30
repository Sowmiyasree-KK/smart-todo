# ⚡ SmartTodo — Full-Stack Productivity App

## Quick Start (2 terminals)

### Terminal 1 — Backend
```bash
cd smart-todo/backend
npm install
npm run dev
# → API running at http://localhost:5000
```

### Terminal 2 — Frontend
```bash
cd smart-todo/frontend
npm install
npm run dev
# → App running at http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## How it works

| Layer | Tech | Notes |
|-------|------|-------|
| Frontend | React 19 + Vite | Proxies `/api/*` → `localhost:5000` |
| Backend  | Node.js + Express | In-memory store, no DB needed |
| State    | React Context + API | Optimistic UI with rollback |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET    | /tasks | List all tasks (supports ?category, ?status, ?priority, ?search, ?sort) |
| POST   | /tasks | Create a task |
| PUT    | /tasks/:id | Update a task |
| DELETE | /tasks/:id | Delete a task |
| PATCH  | /tasks/:id/complete | Toggle complete/pending |
| GET    | /sessions | List pomodoro sessions |
| POST   | /sessions | Log a session |
| GET    | /dashboard/summary | Aggregated stats |
| GET    | /health | Health check |

## Production Deployment

Set `VITE_API_URL` in the frontend to your deployed backend URL:
```
VITE_API_URL=https://your-backend.railway.app
```

- **Frontend** → Vercel / Netlify (`npm run build` → deploy `dist/`)
- **Backend**  → Railway / Render (`npm start`)
