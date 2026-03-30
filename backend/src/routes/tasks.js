const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /tasks - list all tasks with filters
router.get('/', async (req, res) => {
  const { category, status, priority, search, sort } = req.query;
  let query = 'SELECT * FROM tasks WHERE user_id = $1';
  const params = [req.user.id];
  let idx = 2;

  if (category) { query += ` AND category = $${idx++}`; params.push(category); }
  if (status) { query += ` AND status = $${idx++}`; params.push(status); }
  if (priority) { query += ` AND priority = $${idx++}`; params.push(priority); }
  if (search) { query += ` AND (title ILIKE $${idx} OR description ILIKE $${idx})`; params.push(`%${search}%`); idx++; }

  const sortMap = {
    due_date: 'due_date ASC NULLS LAST',
    priority: "CASE priority WHEN 'High' THEN 1 WHEN 'Medium' THEN 2 ELSE 3 END",
    created: 'created_at DESC',
    title: 'title ASC',
  };
  query += ` ORDER BY ${sortMap[sort] || 'created_at DESC'}`;

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ error: 'Failed to fetch tasks.' });
  }
});

// POST /tasks - create task
router.post('/', async (req, res) => {
  const { title, description, category, priority, due_date, due_time, reminder_time, recurring } = req.body;

  if (!title) return res.status(400).json({ error: 'Title is required.' });

  try {
    const result = await pool.query(
      `INSERT INTO tasks (user_id, title, description, category, priority, due_date, due_time, reminder_time, recurring)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [req.user.id, title, description, category || 'Personal', priority || 'Medium',
       due_date || null, due_time || null, reminder_time || 10, recurring || 'none']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ error: 'Failed to create task.' });
  }
});

// PUT /tasks/:id - update task
router.put('/:id', async (req, res) => {
  const { title, description, category, priority, due_date, due_time, reminder_time, recurring } = req.body;
  try {
    const result = await pool.query(
      `UPDATE tasks SET title = COALESCE($1, title), description = COALESCE($2, description),
       category = COALESCE($3, category), priority = COALESCE($4, priority),
       due_date = $5, due_time = $6,
       reminder_time = COALESCE($7, reminder_time), recurring = COALESCE($8, recurring),
       reminder_sent = FALSE, updated_at = NOW()
       WHERE id = $9 AND user_id = $10 RETURNING *`,
      [title, description, category, priority, due_date || null, due_time || null,
       reminder_time, recurring, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found.' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ error: 'Failed to update task.' });
  }
});

// DELETE /tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found.' });
    res.json({ message: 'Task deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task.' });
  }
});

// PATCH /tasks/:id/complete - toggle complete
router.patch('/:id/complete', async (req, res) => {
  try {
    const current = await pool.query('SELECT status FROM tasks WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (current.rows.length === 0) return res.status(404).json({ error: 'Task not found.' });

    const newStatus = current.rows[0].status === 'Completed' ? 'Pending' : 'Completed';
    const completedAt = newStatus === 'Completed' ? new Date() : null;

    const result = await pool.query(
      'UPDATE tasks SET status = $1, completed_at = $2, updated_at = NOW() WHERE id = $3 AND user_id = $4 RETURNING *',
      [newStatus, completedAt, req.params.id, req.user.id]
    );

    // Update streak if completing
    if (newStatus === 'Completed') {
      await updateStreak(req.user.id);
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task status.' });
  }
});

async function updateStreak(userId) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const streak = await pool.query('SELECT * FROM streaks WHERE user_id = $1', [userId]);

    if (streak.rows.length === 0) {
      await pool.query('INSERT INTO streaks (user_id, current_streak, longest_streak, last_active_date) VALUES ($1, 1, 1, $2)', [userId, today]);
      return;
    }

    const s = streak.rows[0];
    const lastDate = s.last_active_date ? new Date(s.last_active_date).toISOString().split('T')[0] : null;

    if (lastDate === today) return; // already updated today

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const newStreak = lastDate === yesterdayStr ? s.current_streak + 1 : 1;
    const longest = Math.max(newStreak, s.longest_streak);

    await pool.query(
      'UPDATE streaks SET current_streak = $1, longest_streak = $2, last_active_date = $3, updated_at = NOW() WHERE user_id = $4',
      [newStreak, longest, today, userId]
    );
  } catch (err) {
    console.error('Streak update error:', err);
  }
}

module.exports = router;
