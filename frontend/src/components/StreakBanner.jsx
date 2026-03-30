import { Flame, Trophy, Zap } from 'lucide-react';
import { getStreakMessage } from '../utils/tips';
import './StreakBanner.css';

export default function StreakBanner({ streak, longestStreak }) {
  const { msg, emoji } = getStreakMessage(streak);

  const segments = Math.min(streak, 7);
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className={`streak-banner ${streak >= 7 ? 'streak-hot' : streak >= 3 ? 'streak-warm' : ''}`}>
      <div className="streak-left">
        <div className="streak-flame">
          <Flame size={28} className={streak > 0 ? 'flame-active' : 'flame-inactive'} />
          <span className="streak-number">{streak}</span>
        </div>
        <div className="streak-info">
          <span className="streak-label">Day Streak {emoji}</span>
          <span className="streak-msg">{msg}</span>
        </div>
      </div>

      <div className="streak-right">
        <div className="streak-dots">
          {days.map((d, i) => (
            <div key={i} className={`streak-dot ${i < segments ? 'filled' : ''}`}>
              <span className="dot-day">{d}</span>
              <div className="dot-circle" />
            </div>
          ))}
        </div>
        {longestStreak > 0 && (
          <div className="streak-best">
            <Trophy size={12} />
            <span>Best: {longestStreak}d</span>
          </div>
        )}
      </div>
    </div>
  );
}
