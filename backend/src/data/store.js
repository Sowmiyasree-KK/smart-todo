/**
 * In-memory store — competition-ready seed data.
 * Rich enough to make every chart, stat card, and calendar look populated.
 */
const { v4: uuid } = require('uuid');

const d = (offset = 0) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + offset);
  return dt.toISOString().split('T')[0];
};
const ts = (offsetDays = 0, h = 10, m = 0) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + offsetDays);
  dt.setHours(h, m, 0, 0);
  return dt.toISOString();
};

const TASKS = [
  // ── Today ──
  {
    id: uuid(), title: 'Present SmartTodo demo to judges',
    description: 'Walk through all features: tasks, calendar, Pomodoro, and dashboard analytics.',
    category: 'Work', priority: 'High', status: 'Pending',
    due_date: d(0), due_time: '14:00', reminder_time: 15, recurring: 'none',
    created_at: ts(-1, 9), updated_at: ts(-1, 9), completed_at: null,
  },
  {
    id: uuid(), title: 'Review pull requests',
    description: 'Check open PRs on the main repo and leave feedback.',
    category: 'Work', priority: 'Medium', status: 'Completed',
    due_date: d(0), due_time: '11:00', reminder_time: 10, recurring: 'none',
    created_at: ts(-1, 8), updated_at: ts(0, 11), completed_at: ts(0, 11),
  },
  {
    id: uuid(), title: 'Morning workout',
    description: '30-minute run + stretching routine.',
    category: 'Personal', priority: 'Medium', status: 'Completed',
    due_date: d(0), due_time: '07:00', reminder_time: 5, recurring: 'daily',
    created_at: ts(-1, 20), updated_at: ts(0, 7, 35), completed_at: ts(0, 7, 35),
  },

  // ── Yesterday (completed — feeds streak & weekly chart) ──
  {
    id: uuid(), title: 'Build REST API endpoints',
    description: 'Implement GET, POST, PUT, DELETE, and PATCH /complete for tasks.',
    category: 'Work', priority: 'High', status: 'Completed',
    due_date: d(-1), due_time: '18:00', reminder_time: 30, recurring: 'none',
    created_at: ts(-2, 9), updated_at: ts(-1, 17, 45), completed_at: ts(-1, 17, 45),
  },
  {
    id: uuid(), title: 'Study system design patterns',
    description: 'Read about microservices, event-driven architecture, and CQRS.',
    category: 'Study', priority: 'High', status: 'Completed',
    due_date: d(-1), due_time: '21:00', reminder_time: 20, recurring: 'none',
    created_at: ts(-2, 14), updated_at: ts(-1, 20, 30), completed_at: ts(-1, 20, 30),
  },

  // ── 2 days ago ──
  {
    id: uuid(), title: 'Design database schema',
    description: 'Create tables for users, tasks, sessions, and streaks.',
    category: 'Work', priority: 'High', status: 'Completed',
    due_date: d(-2), due_time: '17:00', reminder_time: 15, recurring: 'none',
    created_at: ts(-3, 10), updated_at: ts(-2, 16, 50), completed_at: ts(-2, 16, 50),
  },
  {
    id: uuid(), title: 'Read "Atomic Habits" — Ch. 5–8',
    description: 'Habit stacking, environment design, and the two-minute rule.',
    category: 'Personal', priority: 'Low', status: 'Completed',
    due_date: d(-2), due_time: '21:00', reminder_time: 10, recurring: 'none',
    created_at: ts(-3, 19), updated_at: ts(-2, 21, 15), completed_at: ts(-2, 21, 15),
  },

  // ── 3 days ago ──
  {
    id: uuid(), title: 'Set up React project with Vite',
    description: 'Initialize frontend with React 19, Tailwind, and Recharts.',
    category: 'Study', priority: 'Medium', status: 'Completed',
    due_date: d(-3), due_time: '16:00', reminder_time: 10, recurring: 'none',
    created_at: ts(-4, 9), updated_at: ts(-3, 15, 40), completed_at: ts(-3, 15, 40),
  },

  // ── Upcoming ──
  {
    id: uuid(), title: 'Write unit tests for API',
    description: 'Cover all CRUD endpoints with Jest + Supertest.',
    category: 'Work', priority: 'Medium', status: 'Pending',
    due_date: d(1), due_time: '17:00', reminder_time: 30, recurring: 'none',
    created_at: ts(0, 9), updated_at: ts(0, 9), completed_at: null,
  },
  {
    id: uuid(), title: 'Prepare competition slides',
    description: 'Create a 5-slide deck: problem, solution, demo, tech stack, roadmap.',
    category: 'Work', priority: 'High', status: 'Pending',
    due_date: d(1), due_time: '20:00', reminder_time: 60, recurring: 'none',
    created_at: ts(0, 10), updated_at: ts(0, 10), completed_at: null,
  },
  {
    id: uuid(), title: 'Grocery shopping',
    description: 'Vegetables, fruits, dairy, and healthy snacks for the week.',
    category: 'Personal', priority: 'Low', status: 'Pending',
    due_date: d(2), due_time: '11:00', reminder_time: 30, recurring: 'weekly',
    created_at: ts(0, 8), updated_at: ts(0, 8), completed_at: null,
  },
  {
    id: uuid(), title: 'Deploy app to production',
    description: 'Frontend → Vercel, Backend → Railway, configure env variables.',
    category: 'Work', priority: 'High', status: 'Pending',
    due_date: d(3), due_time: '15:00', reminder_time: 60, recurring: 'none',
    created_at: ts(0, 11), updated_at: ts(0, 11), completed_at: null,
  },
  {
    id: uuid(), title: 'Algorithm practice — LeetCode',
    description: 'Solve 3 medium problems: sliding window, two pointers, binary search.',
    category: 'Study', priority: 'Medium', status: 'Pending',
    due_date: d(4), due_time: '19:00', reminder_time: 15, recurring: 'daily',
    created_at: ts(0, 12), updated_at: ts(0, 12), completed_at: null,
  },

  // ── Overdue (for demo realism) ──
  {
    id: uuid(), title: 'Update project documentation',
    description: 'Add API docs, setup guide, and architecture diagram to README.',
    category: 'Work', priority: 'Medium', status: 'Pending',
    due_date: d(-4), due_time: '17:00', reminder_time: 30, recurring: 'none',
    created_at: ts(-5, 9), updated_at: ts(-5, 9), completed_at: null,
  },
];

const SESSIONS = [
  { id: uuid(), task_id: TASKS[0].id,  focus_duration: 25, break_duration: 5, completed_sessions: 2, session_date: d(0),  created_at: ts(0, 9) },
  { id: uuid(), task_id: TASKS[1].id,  focus_duration: 25, break_duration: 5, completed_sessions: 1, session_date: d(0),  created_at: ts(0, 10, 30) },
  { id: uuid(), task_id: TASKS[3].id,  focus_duration: 25, break_duration: 5, completed_sessions: 4, session_date: d(-1), created_at: ts(-1, 14) },
  { id: uuid(), task_id: TASKS[4].id,  focus_duration: 25, break_duration: 5, completed_sessions: 2, session_date: d(-1), created_at: ts(-1, 19) },
  { id: uuid(), task_id: TASKS[5].id,  focus_duration: 25, break_duration: 5, completed_sessions: 3, session_date: d(-2), created_at: ts(-2, 11) },
  { id: uuid(), task_id: TASKS[7].id,  focus_duration: 25, break_duration: 5, completed_sessions: 2, session_date: d(-3), created_at: ts(-3, 10) },
  { id: uuid(), task_id: null,          focus_duration: 25, break_duration: 5, completed_sessions: 1, session_date: d(-4), created_at: ts(-4, 15) },
];

module.exports = { TASKS, SESSIONS, uuid };
