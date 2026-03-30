import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Calendar, Timer, Settings, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Navbar.css';

const NAV = [
  { to: '/',         icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks',    icon: CheckSquare,     label: 'Tasks'     },
  { to: '/calendar', icon: Calendar,        label: 'Calendar'  },
  { to: '/pomodoro', icon: Timer,           label: 'Pomodoro'  },
  { to: '/settings', icon: Settings,        label: 'Settings'  },
];

export default function Navbar() {
  const { state, dispatch } = useApp();
  const dark   = state.theme === 'dark';
  const toggle = () => dispatch({ type: 'SET_THEME', payload: dark ? 'light' : 'dark' });

  return (
    <nav className="navbar">

      {/* ── Brand ── */}
      <div className="navbar-brand">
        <div className="brand-logo" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="url(#navBolt)"/>
            <defs>
              <linearGradient id="navBolt" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#c4b5fd"/>
                <stop offset="100%" stopColor="#4f46e5"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span className="brand-text">SmartTodo</span>
      </div>

      {/* ── Divider ── */}
      <div className="navbar-divider" aria-hidden="true"/>

      {/* ── Nav links ── */}
      <div className="navbar-links" role="navigation" aria-label="Main navigation">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <Icon size={18} strokeWidth={2} className="nav-icon" aria-hidden="true"/>
            <span className="nav-label">{label}</span>
          </NavLink>
        ))}
      </div>

      {/* ── Theme toggle ── */}
      <button className="theme-toggle" onClick={toggle} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
        {dark
          ? <Sun  size={18} strokeWidth={2}/>
          : <Moon size={18} strokeWidth={2}/>}
      </button>

    </nav>
  );
}
