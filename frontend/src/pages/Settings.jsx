import { useState } from 'react';
import { Sun, Moon, Bell, Timer, Trash2, CheckCircle2, Palette, Database, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PageHero from '../components/PageHero';
import './Settings.css';

export default function Settings() {
  const { state, dispatch } = useApp();
  const [saved,  setSaved]  = useState(false);
  const [focus,  setFocus]  = useState(state.pomodoroSettings.focus);
  const [breakT, setBreakT] = useState(state.pomodoroSettings.break);

  const savePomodoro = () => {
    dispatch({ type:'SET_POMODORO_SETTINGS', payload:{ focus:parseInt(focus), break:parseInt(breakT) } });
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const requestNotifications = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(p =>
        alert(p === 'granted' ? '✅ Notifications enabled!' : '❌ Permission denied.')
      );
    } else {
      alert('Browser notifications not supported.');
    }
  };

  const clearData = () => {
    if (confirm('Clear all tasks and sessions? This cannot be undone.')) {
      localStorage.removeItem('smarttodo_state');
      localStorage.removeItem('smarttodo_timer');
      window.location.reload();
    }
  };

  const notifStatus = 'Notification' in window ? Notification.permission : 'unsupported';

  return (
    <div className="page settings-page">
      <PageHero page="settings"/>

      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Customize your SmartTodo experience</p>
        </div>
      </div>

      <div className="settings-grid stagger">
        {/* Appearance */}
        <div className="settings-card fade-in">
          <div className="sc-header">
            <div className="sc-icon" style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)' }}><Palette size={18}/></div>
            <div><h3>Appearance</h3><p>Choose your preferred theme</p></div>
          </div>
          <div className="theme-options">
            {[
              { val:'light', icon:<Sun size={17}/>,  label:'Light' },
              { val:'dark',  icon:<Moon size={17}/>, label:'Dark'  },
            ].map(({ val, icon, label }) => (
              <button key={val}
                className={`theme-option ${state.theme===val?'active':''}`}
                onClick={() => dispatch({ type:'SET_THEME', payload:val })}>
                {icon}<span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pomodoro */}
        <div className="settings-card fade-in">
          <div className="sc-header">
            <div className="sc-icon" style={{ background:'linear-gradient(135deg,#ef4444,#f97316)' }}><Timer size={18}/></div>
            <div><h3>Pomodoro Timer</h3><p>Configure focus and break durations</p></div>
          </div>
          <div className="settings-fields">
            <div className="settings-field">
              <label>Focus Duration (minutes)</label>
              <input type="number" min="1" max="120" value={focus} onChange={e => setFocus(e.target.value)}/>
            </div>
            <div className="settings-field">
              <label>Break Duration (minutes)</label>
              <input type="number" min="1" max="60" value={breakT} onChange={e => setBreakT(e.target.value)}/>
            </div>
          </div>
          <button className="btn-primary sc-save" onClick={savePomodoro}>
            {saved ? <><CheckCircle2 size={15}/> Saved!</> : 'Save Settings'}
          </button>
        </div>

        {/* Notifications */}
        <div className="settings-card fade-in">
          <div className="sc-header">
            <div className="sc-icon" style={{ background:'linear-gradient(135deg,#f59e0b,#f97316)' }}><Bell size={18}/></div>
            <div>
              <h3>Notifications</h3>
              <p>Status: <strong className={`notif-status ${notifStatus}`}>{notifStatus}</strong></p>
            </div>
          </div>
          <p className="sc-desc">Enable browser notifications to receive task reminders and Pomodoro alerts.</p>
          <button className="btn-primary" onClick={requestNotifications} disabled={notifStatus==='granted'}>
            {notifStatus==='granted' ? '✅ Notifications Enabled' : 'Enable Notifications'}
          </button>
        </div>

        {/* Data */}
        <div className="settings-card fade-in">
          <div className="sc-header">
            <div className="sc-icon" style={{ background:'linear-gradient(135deg,#ef4444,#ec4899)' }}><Database size={18}/></div>
            <div><h3>Data Management</h3><p>Manage your local data</p></div>
          </div>
          <p className="sc-desc">All data is stored locally in your browser. Clearing will permanently remove all tasks and sessions.</p>
          <button className="btn-danger" onClick={clearData}><Trash2 size={15}/> Clear All Data</button>
        </div>
      </div>

      {/* About */}
      <div className="about-card fade-in">
        <div className="about-logo">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="8" fill="url(#aboutGrad)"/>
            <path d="M13 4L5 14h7l-1 6 8-10h-7l1-6z" fill="white"/>
            <defs>
              <linearGradient id="aboutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4f46e5"/>
                <stop offset="100%" stopColor="#7c3aed"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <h3>SmartTodo</h3>
          <p>A smart productivity app with task management, Pomodoro timer, calendar view, and analytics dashboard.</p>
          <p className="about-version">v1.0.0 · Built with React + Recharts + Lucide</p>
        </div>
      </div>
    </div>
  );
}
