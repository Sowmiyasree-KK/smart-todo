import { useState } from 'react';
import { Lightbulb, RefreshCw, X } from 'lucide-react';
import { TIPS, getDailyTip } from '../utils/tips';
import './TipCard.css';

export default function TipCard() {
  const [tipIndex, setTipIndex] = useState(() => new Date().getDate() % TIPS.length);
  const [dismissed, setDismissed] = useState(() => {
    const saved = localStorage.getItem('tip_dismissed');
    return saved === new Date().toDateString();
  });
  const [animating, setAnimating] = useState(false);

  if (dismissed) return null;

  const tip = TIPS[tipIndex];

  const nextTip = () => {
    setAnimating(true);
    setTimeout(() => {
      setTipIndex(i => (i + 1) % TIPS.length);
      setAnimating(false);
    }, 200);
  };

  const dismiss = () => {
    localStorage.setItem('tip_dismissed', new Date().toDateString());
    setDismissed(true);
  };

  return (
    <div className="tip-card fade-in">
      <div className="tip-icon-wrap">
        <Lightbulb size={18} />
      </div>
      <div className={`tip-content ${animating ? 'tip-fade-out' : 'tip-fade-in'}`}>
        <span className="tip-label">Tip of the day</span>
        <p className="tip-text"><span className="tip-emoji">{tip.icon}</span> {tip.text}</p>
      </div>
      <div className="tip-actions">
        <button className="tip-btn" onClick={nextTip} title="Next tip"><RefreshCw size={14} /></button>
        <button className="tip-btn tip-dismiss" onClick={dismiss} title="Dismiss"><X size={14} /></button>
      </div>
    </div>
  );
}
