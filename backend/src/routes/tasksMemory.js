const express = require('express');
const { TASKS, uuid } = require('../data/store');

const router = express.Router();

/* ── helpers ── */
const findIdx = (id) => TASKS.findIndex(t => t.id === id);
const now     = ()   => new Date().toISOString();

/* ─────────────────────────────────────────
   GET /tasks
   Query params: category, status, priority, search, sort
───────────────────────────────────────── */
router.get('/', (req, res) => {
  const { category, status, priority, search, sort } = req.query;

  let list = [...TASKS];

  if (category) list = list.filter(t => t.category === category);
  if (status)   list = list.filter(t => t.status   === status);
  if (priority) list = list.filter(t => t.priority === priority);
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(t =>
      t.title.toLowerCase().includes(q) ||
      (t.description || '').toLowerCase().includes(q)
    );
  }

  const PMAP = { High: 1, Medium: 2, Low: 3 };
  switch (sort) {
    case 'due_date':
      list.sort((a, b) => (a.due_date || 'z') > (b.due_date || 'z') ? 1 : -1);
      break;
    case 'priority':
      list.sort((a, b) => (PMAP[a.priority] || 2) - (PMAP[b.priority] || 2));
      break;
    case 'title':
      list.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  res.json(list);
});

/* ─────────────────────────────────────────
   POST /tasks
───────────────────────────────────────── */
router.post('/', (req, res) => {
  const { title, description, category, priority, due_date, due_time, reminder_time, recurring } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required.' });
  }

  const task = {
    id:            uuid(),
    title:         title.trim(),
    description:   description   || '',
    category:      category      || 'Personal',
    priority:      priority      || 'Medium',
    status:        'Pending',
    due_date:      due_date      || null,
    due_time:      due_time      || null,
    reminder_time: reminder_time != null ? Number(reminder_time) : 10,
    recurring:     recurring     || 'none',
    created_at:    now(),
    updated_at:    now(),
    completed_at:  null,
  };

  TASKS.unshift(task);
  res.status(201).json(task);
});

/* ─────────────────────────────────────────
   PUT /tasks/:id
───────────────────────────────────────── */
router.put('/:id', (req, res) => {
  const idx = findIdx(req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found.' });

  const { title, description, category, priority, due_date, due_time, reminder_time, recurring } = req.body;

  const updated = {
    ...TASKS[idx],
    title:         title         ?? TASKS[idx].title,
    description:   description   ?? TASKS[idx].description,
    category:      category      ?? TASKS[idx].category,
    priority:      priority      ?? TASKS[idx].priority,
    due_date:      due_date      !== undefined ? (due_date || null)  : TASKS[idx].due_date,
    due_time:      due_time      !== undefined ? (due_time || null)  : TASKS[idx].due_time,
    reminder_time: reminder_time != null       ? Number(reminder_time) : TASKS[idx].reminder_time,
    recurring:     recurring     ?? TASKS[idx].recurring,
    updated_at:    now(),
  };

  TASKS[idx] = updated;
  res.json(updated);
});

/* ─────────────────────────────────────────
   DELETE /tasks/:id
───────────────────────────────────────── */
router.delete('/:id', (req, res) => {
  const idx = findIdx(req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found.' });

  TASKS.splice(idx, 1);
  res.json({ message: 'Task deleted.', id: req.params.id });
});

/* ─────────────────────────────────────────
   PATCH /tasks/:id/complete  — toggle status
───────────────────────────────────────── */
router.patch('/:id/complete', (req, res) => {
  const idx = findIdx(req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found.' });

  const task      = TASKS[idx];
  const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';

  TASKS[idx] = {
    ...task,
    status:       newStatus,
    completed_at: newStatus === 'Completed' ? now() : null,
    updated_at:   now(),
  };

  res.json(TASKS[idx]);
});

module.exports = router;
