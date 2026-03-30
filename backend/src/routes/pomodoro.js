const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// POST /sessions - log a pomodoro session
router.post('/', async (req, res) => {
  const { task_id, focus_duration, break_duration, completed_sessions } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO pomodoro_sessions (user_id, task_id, focus_duration, break_duration, completed_sessions)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.user.id, task_id || null, focus_duration || 25, break_duration || 5, completed_sessions || 1]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Pomodoro session error:', err);
    res.status(500).json({ error: 'Failed to log session.' });
  }
});

// GET /sessions - get user's sessions
router.get('/', async (req, res) => {
  const { date, limit } = req.query;
  let query = `SELECT ps.*, t.title as task_title FROM pomodoro_sessions ps
               LEFT JOIN tasks t ON ps.task_id = t.id
               WHERE ps.user_id = $1`;
  const params = [req.user.id];

  if (date) { query += ' AND ps.session_date = $2'; params.push(date); }
  query += ' ORDER BY ps.created_at DESC';
  if (limit) { query += ` LIMIT ${parseInt(limit)}`; }

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sessions.' });
  }
});

// GET /sessions/stats - weekly stats
router.get('/stats', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT session_date, SUM(completed_sessions) as sessions, SUM(focus_duration * completed_sessions) as total_minutes
       FROM pomodoro_sessions WHERE user_id = $1 AND session_date >= CURRENT_DATE - INTERVAL '7 days'
       GROUP BY session_date ORDER BY session_date`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
});

module.exports = router;
