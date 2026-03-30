const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /dashboard/summary
router.get('/summary', async (req, res) => {
  const userId = req.user.id;
  try {
    // Task stats
    const taskStats = await pool.query(
      `SELECT
         COUNT(*) as total,
         COUNT(*) FILTER (WHERE status = 'Completed') as completed,
         COUNT(*) FILTER (WHERE status = 'Pending') as pending,
         COUNT(*) FILTER (WHERE status = 'Pending' AND due_date < CURRENT_DATE) as overdue
       FROM tasks WHERE user_id = $1`,
      [userId]
    );

    // Category breakdown
    const categoryStats = await pool.query(
      `SELECT category, COUNT(*) as total,
         COUNT(*) FILTER (WHERE status = 'Completed') as completed
       FROM tasks WHERE user_id = $1 GROUP BY category`,
      [userId]
    );

    // Weekly task completion (last 7 days)
    const weeklyStats = await pool.query(
      `SELECT DATE(completed_at) as date, COUNT(*) as completed
       FROM tasks WHERE user_id = $1 AND status = 'Completed'
       AND completed_at >= NOW() - INTERVAL '7 days'
       GROUP BY DATE(completed_at) ORDER BY date`,
      [userId]
    );

    // Pomodoro total
    const pomodoroStats = await pool.query(
      `SELECT COALESCE(SUM(completed_sessions), 0) as total_sessions,
              COALESCE(SUM(focus_duration * completed_sessions), 0) as total_minutes
       FROM pomodoro_sessions WHERE user_id = $1`,
      [userId]
    );

    // Streak
    const streakData = await pool.query(
      'SELECT current_streak, longest_streak, last_active_date FROM streaks WHERE user_id = $1',
      [userId]
    );

    // Priority breakdown
    const priorityStats = await pool.query(
      `SELECT priority, COUNT(*) as total,
         COUNT(*) FILTER (WHERE status = 'Completed') as completed
       FROM tasks WHERE user_id = $1 GROUP BY priority`,
      [userId]
    );

    const stats = taskStats.rows[0];
    const total = parseInt(stats.total);
    const completed = parseInt(stats.completed);

    res.json({
      tasks: {
        total,
        completed,
        pending: parseInt(stats.pending),
        overdue: parseInt(stats.overdue),
        completion_rate: total > 0 ? Math.round((completed / total) * 100) : 0,
      },
      categories: categoryStats.rows,
      weekly: weeklyStats.rows,
      pomodoro: pomodoroStats.rows[0],
      streak: streakData.rows[0] || { current_streak: 0, longest_streak: 0 },
      priority: priorityStats.rows,
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard data.' });
  }
});

module.exports = router;
