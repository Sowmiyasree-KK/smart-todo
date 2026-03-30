import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Calendar from './pages/Calendar';
import Pomodoro from './pages/Pomodoro';
import Settings from './pages/Settings';
import { Toast } from './components/Toast';
import ConnectionBanner from './components/ConnectionBanner';
import './App.css';

/* Toast layer — inside AppProvider */
function ToastLayer() {
  const { toasts, removeToast } = useApp();
  if (!toasts.length) return null;
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
      ))}
    </div>
  );
}

/* Animated loading bar */
function LoadingBar() {
  const { state } = useApp();
  if (!state.loading.tasks) return null;
  return <div className="global-loading-bar" aria-hidden="true" />;
}

/* Page transition wrapper — re-mounts on route change */
function AnimatedRoutes() {
  const location = useLocation();
  const key = location.pathname;

  return (
    <main className="main-content">
      <div key={key} className="page-transition-wrap">
        <Routes location={location}>
          <Route path="/"         element={<Dashboard />} />
          <Route path="/tasks"    element={<Tasks />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <LoadingBar />
        <Navbar />
        <ConnectionBanner />
        <AnimatedRoutes />
        <ToastLayer />
      </BrowserRouter>
    </AppProvider>
  );
}
