import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import './Toast.css';

const DURATION = 4000;

export function Toast({ message, type = 'error', onClose }) {
  const [visible,  setVisible]  = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Slide in
    const t0 = setTimeout(() => setVisible(true), 16);

    // Drain progress bar
    const start = Date.now();
    const raf = () => {
      const elapsed = Date.now() - start;
      const pct = Math.max(0, 100 - (elapsed / DURATION) * 100);
      setProgress(pct);
      if (pct > 0) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Auto-dismiss
    const t1 = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 320);
    }, DURATION);

    return () => { clearTimeout(t0); clearTimeout(t1); };
  }, [onClose]);

  const dismiss = () => { setVisible(false); setTimeout(onClose, 320); };

  const ICONS = {
    success: <CheckCircle2 size={16} />,
    error:   <XCircle     size={16} />,
    info:    <Info        size={16} />,
  };

  return (
    <div className={`toast toast-${type} ${visible ? 'toast-in' : 'toast-out'}`} role="alert">
      <span className="toast-icon">{ICONS[type] ?? ICONS.info}</span>
      <span className="toast-msg">{message}</span>
      <button className="toast-close" onClick={dismiss} aria-label="Dismiss"><X size={13} /></button>
      <div className="toast-progress" style={{ width: `${progress}%` }} />
    </div>
  );
}

/* Legacy export kept for compatibility */
export function ToastContainer({ error, onClear }) {
  if (!error) return null;
  return (
    <div className="toast-container">
      <Toast message={error} type="error" onClose={onClear} />
    </div>
  );
}
