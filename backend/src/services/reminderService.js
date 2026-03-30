const cron = require('node-cron');
const pool = require('../config/db');

// Check every minute for due reminders
const startReminderService = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const result = await pool.query(
        `SELECT t.*, u.email, u.name as user_name
         FROM tasks t JOIN users u ON t.user_id = u.id
         WHERE t.status = 'Pending'
           AND t.reminder_sent = FALSE
           AND t.due_date IS NOT NULL
           AND t.due_time IS NOT NULL
           AND (t.due_date + t.due_time::time - (t.reminder_time || ' minutes')::interval) <= NOW()
           AND (t.due_date + t.due_time::time) > NOW()`
      );

      for (const task of result.rows) {
        console.log(`🔔 Reminder: Task "${task.title}" is due soon for ${task.user_name}`);
        // Mark as sent
        await pool.query('UPDATE tasks SET reminder_sent = TRUE WHERE id = $1', [task.id]);
      }
    } catch (err) {
      // Silently handle if DB not connected
    }
  });

  console.log('⏰ Reminder service started');
};

module.exports = { startReminderService };
