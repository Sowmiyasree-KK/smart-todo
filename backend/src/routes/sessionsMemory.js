const express = require('express');
const { SESSIONS, uuid } = require('../data/store');

const router = express.Router();
const now = () => new Date().toISOString();

/* ─────────────────────────────────────────
   GET /sessions/stats  ← MUST be before /:id
───────────────────────────────────────── */
router.get('/stats', (_req, res) => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  const stats = days.map(date => {
    const ds = SESSIONS.filter(s => s.session_date === date);
    return {
      session_date:  date,
      sessions:      ds.reduce((sum, s) => sum + s.completed_sessions, 0),
      total_minutes: ds.reduce((sum, s) => sum + s.focus_duration * s.completed_sessions, 0),
    };
  });
  res.json(stats);
});

/* ─────────────────────────────────────────
   GET /sessions
───────────────────────────────────────── */
router.get('/', (req, res) => {
  const { date, limit } = req.query;
  let list = [...SESSIONS];
  if (date) list = list.filter(s => s.session_date === date);
  list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  if (limit) list = list.slice(0, parseInt(limit));
  res.json(list);
});

/* ─────────────────────────────────────────
   POST /sessions
───────────────────────────────────────── */
router.post('/', (req, res) => {
  const { task_id, focus_duration, break_duration, completed_sessions } = req.body;
  const session = {
    id:                 uuid(),
    task_id:            task_id            || null,
    focus_duration:     Number(focus_duration)     || 25,
    break_duration:     Number(break_duration)     || 5,
    completed_sessions: Number(completed_sessions) || 1,
    session_date:       new Date().toISOString().split('T')[0],
    created_at:         now(),
  };
  SESSIONS.unshift(session);
  res.status(201).json(session);
});

module.exports = router;
