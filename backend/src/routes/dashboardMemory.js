const express = require('express');
const { TASKS, SESSIONS } = require('../data/store');

const router = express.Router();

const isOverdue = (t) => {
  if (!t.due_date || t.status === 'Completed') return false;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return new Date(t.due_date + 'T00:00:00') < today;
};

/* GET /dashboard/summary */
router.get('/summary', (req, res) => {
  const total     = TASKS.length;
  const completed = TASKS.filter(t => t.status === 'Completed').length;
  const pending   = TASKS.filter(t => t.status === 'Pending').length;
  const overdue   = TASKS.filter(t => isOverdue(t)).length;

  const categories = ['Study', 'Work', 'Personal'].map(cat => ({
    category:  cat,
    total:     TASKS.filter(t => t.category === cat).length,
    completed: TASKS.filter(t => t.category === cat && t.status === 'Completed').length,
  }));

  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  const weekly = days.map(date => ({
    date,
    completed: TASKS.filter(t => t.completed_at && t.completed_at.startsWith(date)).length,
  }));

  const totalSessions = SESSIONS.reduce((s, x) => s + x.completed_sessions, 0);
  const totalMinutes  = SESSIONS.reduce((s, x) => s + x.focus_duration * x.completed_sessions, 0);

  // Streak
  const dateSet = new Set(TASKS.filter(t => t.completed_at).map(t => t.completed_at.split('T')[0]));
  let streak = 0;
  const d = new Date();
  while (dateSet.has(d.toISOString().split('T')[0])) {
    streak++;
    d.setDate(d.getDate() - 1);
  }

  res.json({
    tasks: {
      total, completed, pending, overdue,
      completion_rate: total ? Math.round((completed / total) * 100) : 0,
    },
    categories,
    weekly,
    pomodoro: { total_sessions: totalSessions, total_minutes: totalMinutes },
    streak:   { current_streak: streak, longest_streak: streak },
  });
});

module.exports = router;
