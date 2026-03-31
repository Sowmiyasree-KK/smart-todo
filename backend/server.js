require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const taskRoutes      = require('./src/routes/tasksMemory');
const sessionRoutes   = require('./src/routes/sessionsMemory');
const dashboardRoutes = require('./src/routes/dashboardMemory');

const app  = express();
const PORT = process.env.PORT || 5000;

/* ── Allowed origins ── */
const ALLOWED_ORIGINS = [
  'http://localhost:5173',                                                        // Vite dev
  'http://localhost:3000',                                                        // CRA dev
  'https://smart-todo-rer4owf65-sowmiyasree-kks-projects.vercel.app',            // Vercel deploy
  process.env.FRONTEND_URL,                                                       // env override
].filter(Boolean);

/* ── CORS ── */
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin '${origin}' not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,   // some legacy browsers choke on 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));  // handle preflight for every route
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ── Health check ── */
app.get('/health', (_req, res) =>
  res.json({ status: 'ok', mode: 'in-memory', timestamp: new Date() })
);

/* ── Routes ── */
app.use('/tasks',     taskRoutes);
app.use('/sessions',  sessionRoutes);
app.use('/dashboard', dashboardRoutes);

/* ── 404 ── */
app.use((req, res) =>
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` })
);

/* ── Error handler ── */
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`🚀 SmartTodo API running at http://localhost:${PORT}`);
  console.log(`   Mode: in-memory (no database required)`);
  console.log(`   Allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);
});

module.exports = app;
