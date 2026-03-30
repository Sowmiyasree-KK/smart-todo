import './EmptyState.css';

const CONFIGS = {
  tasks: {
    emoji: '📋',
    svg: (
      <svg width="130" height="110" viewBox="0 0 130 110" fill="none">
        <rect x="18" y="12" width="94" height="82" rx="14" fill="var(--surface2)" stroke="var(--border)" strokeWidth="1.5"/>
        <rect x="30" y="28" width="70" height="7" rx="3.5" fill="var(--border)"/>
        <rect x="30" y="43" width="50" height="6" rx="3" fill="var(--border)" opacity=".7"/>
        <rect x="30" y="57" width="60" height="6" rx="3" fill="var(--border)" opacity=".5"/>
        <rect x="30" y="71" width="40" height="6" rx="3" fill="var(--border)" opacity=".35"/>
        <circle cx="100" cy="84" r="20" fill="var(--primary-bg)" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="5 3"/>
        <path d="M93 84h14M100 77v14" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  calendar: {
    emoji: '📅',
    svg: (
      <svg width="130" height="110" viewBox="0 0 130 110" fill="none">
        <rect x="12" y="18" width="106" height="82" rx="14" fill="var(--surface2)" stroke="var(--border)" strokeWidth="1.5"/>
        <rect x="12" y="18" width="106" height="28" rx="14" fill="var(--primary-bg)"/>
        <rect x="12" y="32" width="106" height="14" fill="var(--primary-bg)"/>
        <circle cx="36" cy="13" r="6" fill="var(--primary)" opacity=".35"/>
        <circle cx="94" cy="13" r="6" fill="var(--primary)" opacity=".35"/>
        <rect x="36" y="10" width="58" height="6" rx="3" fill="var(--primary)" opacity=".2"/>
        {[0,1,2,3,4,5,6].map(i => (
          <rect key={i} x={20+i*13} y="56" width="9" height="9" rx="3"
            fill={i===3 ? 'var(--primary)' : 'var(--border)'} opacity={i===3 ? .8 : .45}/>
        ))}
        {[0,1,2,3,4,5,6].map(i => (
          <rect key={i} x={20+i*13} y="72" width="9" height="9" rx="3" fill="var(--border)" opacity=".3"/>
        ))}
        {[0,1,2,3,4,5,6].map(i => (
          <rect key={i} x={20+i*13} y="88" width="9" height="9" rx="3" fill="var(--border)" opacity=".2"/>
        ))}
      </svg>
    ),
  },
  sessions: {
    emoji: '🍅',
    svg: (
      <svg width="120" height="110" viewBox="0 0 120 110" fill="none">
        <circle cx="60" cy="52" r="38" fill="var(--surface2)" stroke="var(--border)" strokeWidth="1.5"/>
        <circle cx="60" cy="52" r="28" fill="var(--surface)" stroke="var(--border)" strokeWidth="1"/>
        <line x1="60" y1="52" x2="60" y2="30" stroke="var(--text-light)" strokeWidth="3" strokeLinecap="round"/>
        <line x1="60" y1="52" x2="78" y2="52" stroke="var(--text-light)" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="60" cy="52" r="4" fill="var(--primary)" opacity=".5"/>
        <path d="M32 96 Q60 84 88 96" stroke="var(--border)" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <circle cx="60" cy="10" r="5" fill="var(--primary)" opacity=".3"/>
        <rect x="55" y="4" width="10" height="7" rx="3.5" fill="var(--primary)" opacity=".2"/>
      </svg>
    ),
  },
  default: {
    emoji: '✨',
    svg: (
      <svg width="120" height="110" viewBox="0 0 120 110" fill="none">
        <rect x="18" y="18" width="84" height="74" rx="16" fill="var(--surface2)" stroke="var(--border)" strokeWidth="1.5"/>
        <circle cx="60" cy="55" r="20" fill="var(--primary-bg)" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="5 3"/>
        <path d="M60 46v12M60 62v3" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
};

const COPY = {
  tasks:    { title: 'No tasks yet',          msg: 'Create your first task and start building momentum.' },
  calendar: { title: 'Nothing scheduled',     msg: 'Pick a date and add a task to plan your day.' },
  sessions: { title: 'No focus sessions yet', msg: 'Start a Pomodoro timer to log your first session.' },
  default:  { title: 'Nothing here yet',      msg: 'Add something to get started.' },
};

export default function EmptyState({ type = 'default', title, message, action }) {
  const cfg = CONFIGS[type] || CONFIGS.default;
  const copy = COPY[type] || COPY.default;

  return (
    <div className="empty-state pop-in">
      <div className="empty-svg">{cfg.svg}</div>
      <h3 className="empty-title">{title || copy.title}</h3>
      <p className="empty-msg">{message || copy.msg}</p>
      {action && <div className="empty-action">{action}</div>}
    </div>
  );
}
