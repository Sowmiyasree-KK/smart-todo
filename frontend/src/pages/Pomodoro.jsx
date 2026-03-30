import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, Timer, Coffee } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PageHero from '../components/PageHero';
import EmptyState from '../components/EmptyState';
import './Pomodoro.css';

const TIMER_KEY = 'smarttodo_timer';

function loadTimer() {
  try {
    const raw = localStorage.getItem(TIMER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

export default function Pomodoro() {
  const { state, dispatch } = useApp();
  const { pomodoroSettings, tasks } = state;

  // Derive seconds from settings
  const focusSecs = pomodoroSettings.focus * 60;
  const breakSecs = pomodoroSettings.break * 60;

  // Restore persisted state on mount
  const saved = loadTimer();
  const initMode = saved?.mode ?? 'focus';
  const initRunning = saved?.wasRunning ?? false;
  const initSessions = saved?.sessions ?? 0;
  const initTask = saved?.selectedTask ?? '';
  const initTime = (() => {
    if (!saved) return focusSecs;
    if (saved.wasRunning) {
      const elapsed = Math.floor((Date.now() - (saved.savedAt ?? Date.now())) / 1000);
      return Math.max(0, (saved.timeLeft ?? focusSecs) - elapsed);
    }
    return saved.timeLeft ?? focusSecs;
  })();

  const [mode, setMode] = useState(initMode);
  const [timeLeft, setTimeLeft] = useState(initTime);
  const [running, setRunning] = useState(initRunning && initTime > 0);
  const [sessions, setSessions] = useState(initSessions);
  const [selectedTask, setSelectedTask] = useState(initTask);

  // Use refs so the interval callback always sees fresh values
  const modeRef = useRef(mode);
  const timeLeftRef = useRef(timeLeft);
  const sessionsRef = useRef(sessions);
  const selectedTaskRef = useRef(selectedTask);
  const focusSecsRef = useRef(focusSecs);
  const breakSecsRef = useRef(breakSecs);

  modeRef.current = mode;
  timeLeftRef.current = timeLeft;
  sessionsRef.current = sessions;
  selectedTaskRef.current = selectedTask;
  focusSecsRef.current = focusSecs;
  breakSecsRef.current = breakSecs;

  const intervalRef = useRef(null);

  // Persist on every relevant change
  useEffect(() => {
    localStorage.setItem(TIMER_KEY, JSON.stringify({
      timeLeft, mode, sessions, selectedTask,
      savedAt: Date.now(), wasRunning: running,
    }));
  }, [timeLeft, mode, sessions, selectedTask, running]);

  // Single interval — reads from refs to avoid stale closures
  useEffect(() => {
    if (!running) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      const next = timeLeftRef.current - 1;

      if (next <= 0) {
        clearInterval(intervalRef.current);
        setTimeLeft(0);
        setRunning(false);

        // Session complete
        if (modeRef.current === 'focus') {
          const newCount = sessionsRef.current + 1;
          setSessions(newCount);
          dispatch({
            type: 'ADD_SESSION',
            payload: {
              task_id: selectedTaskRef.current || null,
              focus_duration: focusSecsRef.current / 60,
              break_duration: breakSecsRef.current / 60,
              completed_sessions: 1,
              session_date: new Date().toISOString().split('T')[0],
            },
          });
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🍅 Focus session complete!', { body: 'Time for a break.' });
          }
          setMode('break');
          setTimeLeft(breakSecsRef.current);
        } else {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('☕ Break over!', { body: 'Ready to focus again?' });
          }
          setMode('focus');
          setTimeLeft(focusSecsRef.current);
        }
        return;
      }

      setTimeLeft(next);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [running, dispatch]); // only re-run when running toggles

  const reset = () => {
    setRunning(false);
    setTimeLeft(mode === 'focus' ? focusSecs : breakSecs);
  };

  const switchMode = (m) => {
    setRunning(false);
    setMode(m);
    setTimeLeft(m === 'focus' ? focusSecs : breakSecs);
  };

  const total = mode === 'focus' ? focusSecs : breakSecs;
  const safeTotal = total > 0 ? total : 1;
  const progress = Math.min(100, ((safeTotal - timeLeft) / safeTotal) * 100);
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');

  const pendingTasks = tasks.filter(t => t.status === 'Pending');
  const activeTask = tasks.find(t => t.id === selectedTask);

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="page pomodoro-page">
      <PageHero page="pomodoro"/>

      <div className="page-header">
        <div>
          <h1 className="page-title">Pomodoro Timer</h1>
          <p className="page-subtitle">Stay focused, work smarter</p>
        </div>
        <div className="session-count">
          <CheckCircle2 size={16}/>
          <span>{sessions} session{sessions !== 1 ? 's' : ''} today</span>
        </div>
      </div>

      <div className="pomodoro-layout">
        {/* Timer Card */}
        <div className={`timer-card fade-in${running ? ' running' : ''}`}>
          <div className="mode-tabs">
            <button
              className={`mode-tab ${mode === 'focus' ? 'active' : ''}`}
              onClick={() => switchMode('focus')}
            >
              <Timer size={15} /> Focus
            </button>
            <button
              className={`mode-tab ${mode === 'break' ? 'active' : ''}`}
              onClick={() => switchMode('break')}
            >
              <Coffee size={15} /> Break
            </button>
          </div>

          {/* Circular progress */}
          <div className="timer-circle-wrap">
            <svg className="timer-svg" viewBox="0 0 200 200" aria-hidden="true">
              <circle cx="100" cy="100" r="90" fill="none" stroke="var(--surface2)" strokeWidth="8" />
              <circle
                cx="100" cy="100" r="90" fill="none"
                stroke={mode === 'focus' ? 'url(#timerGrad)' : '#10b981'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 100 100)"
                style={{ transition: running ? 'stroke-dashoffset .9s linear' : 'none' }}
              />
              <defs>
                <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4f46e5"/>
                  <stop offset="100%" stopColor="#7c3aed"/>
                </linearGradient>
              </defs>
            </svg>
            <div className="timer-display">
              <span className="timer-time">{mins}:{secs}</span>
              <span className="timer-mode-label">{mode === 'focus' ? '🍅 Focus' : '☕ Break'}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="timer-controls">
            <button className="ctrl-btn reset-btn" onClick={reset} aria-label="Reset timer">
              <RotateCcw size={18} />
            </button>
            <button
              className={`ctrl-btn play-btn ${running ? 'pause' : 'play'}`}
              onClick={() => setRunning(r => !r)}
              aria-label={running ? 'Pause' : 'Start'}
            >
              {running ? <Pause size={24} /> : <Play size={24} />}
            </button>
            {/* spacer to keep play-btn centred */}
            <div className="ctrl-spacer" />
          </div>

          {/* Task selector */}
          <div className="task-selector">
            <label htmlFor="pomo-task">Focusing on:</label>
            <select
              id="pomo-task"
              value={selectedTask}
              onChange={e => setSelectedTask(e.target.value)}
            >
              <option value="">— Select a task —</option>
              {pendingTasks.map(t => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          </div>

          {activeTask && (
            <div className="active-task-chip">
              <span className="chip-dot" />
              <span className="chip-text">{activeTask.title}</span>
            </div>
          )}
        </div>

        {/* Session history */}
        <div className="sessions-panel fade-in">
          <h3 className="panel-title">Recent Sessions</h3>
          {state.sessions.length === 0 ? (
            <EmptyState
              type="sessions"
              title="No sessions yet"
              message="Start your first Pomodoro to track your focus sessions."
            />
          ) : (
            <div className="sessions-list">
              {state.sessions.slice(0, 12).map(s => {
                const task = tasks.find(t => t.id === s.task_id);
                return (
                  <div key={s.id} className="session-item">
                    <div className="session-icon">🍅</div>
                    <div className="session-info">
                      <span className="session-task">{task?.title || 'General focus'}</span>
                      <span className="session-meta">{s.focus_duration}min · {s.session_date}</span>
                    </div>
                    <span className="session-count-badge">×{s.completed_sessions}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
