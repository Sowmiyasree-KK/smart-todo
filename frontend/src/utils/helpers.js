export const CATEGORIES = {
  Study: { color: '#7c3aed', bg: '#f5f3ff', label: 'Study', icon: '📚' },
  Work:  { color: '#2563eb', bg: '#eff6ff', label: 'Work',  icon: '💼' },
  Personal: { color: '#16a34a', bg: '#f0fdf4', label: 'Personal', icon: '🏠' },
};

export const PRIORITIES = {
  High:   { color: '#dc2626', bg: '#fef2f2', label: 'High',   dot: '🔴' },
  Medium: { color: '#d97706', bg: '#fffbeb', label: 'Medium', dot: '🟡' },
  Low:    { color: '#16a34a', bg: '#f0fdf4', label: 'Low',    dot: '🟢' },
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  return `${hour % 12 || 12}:${m} ${ampm}`;
};

export const isOverdue = (task) => {
  if (!task.due_date || task.status === 'Completed') return false;
  const today = new Date(); today.setHours(0,0,0,0);
  const due = new Date(task.due_date + 'T00:00:00');
  return due < today;
};

export const isDueToday = (task) => {
  if (!task.due_date || task.status === 'Completed') return false;
  const today = new Date().toISOString().split('T')[0];
  return task.due_date === today;
};

export const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2,9)}`;

export const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
};

export const getDayLabel = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short' });
};

export const scheduleReminder = (task) => {
  if (!task.due_date || !task.due_time) return;
  if (!('Notification' in window)) return;

  const dueDateTime = new Date(`${task.due_date}T${task.due_time}`);
  const reminderMs = dueDateTime.getTime() - (task.reminder_time || 10) * 60 * 1000;
  const now = Date.now();
  const delay = reminderMs - now;

  if (delay <= 0) return;

  Notification.requestPermission().then((perm) => {
    if (perm === 'granted') {
      setTimeout(() => {
        new Notification(`⏰ Reminder: ${task.title}`, {
          body: `Due at ${formatTime(task.due_time)} — ${task.category}`,
          icon: '/favicon.ico',
        });
      }, delay);
    }
  });
};
