import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { api } from '../utils/api';
import { scheduleReminder } from '../utils/helpers';

const AppContext = createContext(null);

/* ─────────────────────────────────────────
   Local-only state  (theme · sessions · pomodoro)
───────────────────────────────────────── */
const loadLocal = () => {
  try { return JSON.parse(localStorage.getItem('smarttodo_local') || '{}'); } catch { return {}; }
};

function localReducer(state, action) {
  switch (action.type) {
    case 'ADD_SESSION':
      return { ...state, sessions: [action.payload, ...(state.sessions || [])] };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_POMODORO_SETTINGS':
      return { ...state, pomodoroSettings: { ...state.pomodoroSettings, ...action.payload } };
    default:
      return state;
  }
}

const _saved = loadLocal();
const LOCAL_INIT = {
  sessions:         _saved.sessions         ?? [],
  theme:            _saved.theme            ?? 'light',
  pomodoroSettings: _saved.pomodoroSettings ?? { focus: 25, break: 5 },
};

/* ─────────────────────────────────────────
   Tasks reducer
───────────────────────────────────────── */
function tasksReducer(state, action) {
  switch (action.type) {
    case 'SET_ALL': return action.payload;
    case 'ADD':     return [action.payload, ...state];
    case 'UPDATE':  return state.map(t => t.id === action.payload.id ? action.payload : t);
    case 'DELETE':  return state.filter(t => t.id !== action.payload);
    case 'TOGGLE':  return state.map(t => {
      if (t.id !== action.payload) return t;
      const s = t.status === 'Completed' ? 'Pending' : 'Completed';
      return { ...t, status: s, completed_at: s === 'Completed' ? new Date().toISOString() : null };
    });
    default: return state;
  }
}

/* ─────────────────────────────────────────
   Toast reducer
───────────────────────────────────────── */
let _tid = 0;
function toastReducer(state, action) {
  switch (action.type) {
    case 'ADD':    return [...state, { ...action.payload, id: ++_tid }];
    case 'REMOVE': return state.filter(t => t.id !== action.payload);
    default:       return state;
  }
}

/* ─────────────────────────────────────────
   Provider
───────────────────────────────────────── */
export function AppProvider({ children }) {
  const [tasks,        dispatchTasks]   = useReducer(tasksReducer, []);
  const [local,        dispatchLocal]   = useReducer(localReducer, LOCAL_INIT);
  const [toasts,       dispatchToasts]  = useReducer(toastReducer, []);
  const [tasksLoading, setTasksLoading] = useReducer((_, v) => v, true);  // true on first render
  const [fetchFailed,  setFetchFailed]  = useReducer((_, v) => v, false);
  const [actionBusy,   setActionBusy]   = useReducer((_, v) => v, false);

  // Snapshot for optimistic rollback — always mirrors the last confirmed server state
  const snapshot = useRef([]);
  // Guard against StrictMode double-fetch
  const fetchedOnce = useRef(false);

  /* Persist local state */
  useEffect(() => {
    localStorage.setItem('smarttodo_local', JSON.stringify(local));
  }, [local]);

  /* Apply theme */
  useEffect(() => {
    document.documentElement.classList.toggle('dark', local.theme === 'dark');
  }, [local.theme]);

  /* ── Toast helpers ── */
  const addToast = useCallback((message, type = 'error') => {
    dispatchToasts({ type: 'ADD', payload: { message, type } });
  }, []);

  const removeToast = useCallback((id) => {
    dispatchToasts({ type: 'REMOVE', payload: id });
  }, []);

  /* ── Fetch tasks ── */
  const fetchTasks = useCallback(async () => {
    setTasksLoading(true);
    setFetchFailed(false);
    try {
      const data = await api.getTasks();
      dispatchTasks({ type: 'SET_ALL', payload: data });
      snapshot.current = data;
      setFetchFailed(false);
    } catch (err) {
      setFetchFailed(true);
      addToast(err.message, 'error');
    } finally {
      setTasksLoading(false);
    }
  }, [addToast]);

  // Fetch once on mount — ref guard prevents StrictMode double-fetch
  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;
    fetchTasks();
  }, [fetchTasks]);

  /* ── ADD ── */
  const addTask = useCallback(async (form) => {
    setActionBusy(true);
    try {
      const created = await api.createTask(form);
      scheduleReminder(created);
      dispatchTasks({ type: 'ADD', payload: created });
      snapshot.current = [created, ...snapshot.current];
      addToast('✅ Task added!', 'success');
      return created;
    } catch (err) {
      addToast(err.message, 'error');
      throw err;   // re-throw → modal stays open
    } finally {
      setActionBusy(false);
    }
  }, [addToast]);

  /* ── UPDATE ── */
  const updateTask = useCallback(async (id, form) => {
    setActionBusy(true);
    try {
      const updated = await api.updateTask(id, form);
      dispatchTasks({ type: 'UPDATE', payload: updated });
      snapshot.current = snapshot.current.map(t => t.id === id ? updated : t);
      addToast('✏️ Task updated!', 'success');
      return updated;
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    } finally {
      setActionBusy(false);
    }
  }, [addToast]);

  /* ── DELETE (optimistic with rollback) ── */
  const deleteTask = useCallback(async (id) => {
    const prev = snapshot.current;
    // Optimistic remove from both state and snapshot immediately
    dispatchTasks({ type: 'DELETE', payload: id });
    snapshot.current = prev.filter(t => t.id !== id);
    try {
      await api.deleteTask(id);
      // Already removed — nothing more to do
    } catch (err) {
      // Rollback
      dispatchTasks({ type: 'SET_ALL', payload: prev });
      snapshot.current = prev;
      addToast(err.message, 'error');
    }
  }, [addToast]);

  /* ── TOGGLE (optimistic with rollback) ── */
  const toggleTask = useCallback(async (id) => {
    const prev = snapshot.current;
    dispatchTasks({ type: 'TOGGLE', payload: id });
    try {
      const updated = await api.toggleTask(id);
      // Sync authoritative server response (completed_at, updated_at)
      dispatchTasks({ type: 'UPDATE', payload: updated });
      snapshot.current = snapshot.current.map(t => t.id === id ? updated : t);
    } catch (err) {
      dispatchTasks({ type: 'SET_ALL', payload: prev });
      snapshot.current = prev;
      addToast(err.message, 'error');
    }
  }, [addToast]);

  /* ── Unified dispatch shim — all pages call this unchanged ── */
  const dispatch = useCallback((action) => {
    switch (action.type) {
      case 'ADD_TASK':    return addTask(action.payload);
      case 'UPDATE_TASK': return updateTask(action.payload.id, action.payload);
      case 'DELETE_TASK': return deleteTask(action.payload);
      case 'TOGGLE_TASK': return toggleTask(action.payload);
      case 'ADD_SESSION':
      case 'SET_THEME':
      case 'SET_POMODORO_SETTINGS':
        return dispatchLocal(action);
      default:
        console.warn('[AppContext] Unknown action:', action.type);
    }
  }, [addTask, updateTask, deleteTask, toggleTask]);

  const value = {
    state: {
      tasks,
      sessions:         local.sessions,
      theme:            local.theme,
      pomodoroSettings: local.pomodoroSettings,
      loading: { tasks: tasksLoading, action: actionBusy },
      fetchFailed,
    },
    dispatch,
    refetchTasks: fetchTasks,
    toasts,
    removeToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
