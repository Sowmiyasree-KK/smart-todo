require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const taskRoutes      = require('./src/routes/tasksMemory');
const sessionRoutes   = require('./src/routes/sessionsMemory');
const dashboardRoutes = require('./src/routes/dashboardMemory');

const app  = express();
const PORT = process.env.PORT || 5000;

/* ── Middleware ── */
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
}));
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
  console.log(`   Tasks endpoint: http://localhost:${PORT}/tasks`);
});

module.exports = app;
