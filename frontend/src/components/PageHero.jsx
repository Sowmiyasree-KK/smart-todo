import './PageHero.css';

const ILLUSTRATIONS = {
  dashboard: (
    <svg width="140" height="100" viewBox="0 0 140 100" fill="none">
      <rect x="8" y="30" width="28" height="60" rx="5" fill="rgba(255,255,255,.25)"/>
      <rect x="8" y="50" width="28" height="40" rx="5" fill="rgba(255,255,255,.45)"/>
      <rect x="44" y="18" width="28" height="72" rx="5" fill="rgba(255,255,255,.25)"/>
      <rect x="44" y="35" width="28" height="55" rx="5" fill="rgba(255,255,255,.45)"/>
      <rect x="80" y="8" width="28" height="82" rx="5" fill="rgba(255,255,255,.25)"/>
      <rect x="80" y="22" width="28" height="68" rx="5" fill="rgba(255,255,255,.55)"/>
      <rect x="116" y="40" width="16" height="50" rx="4" fill="rgba(255,255,255,.35)"/>
      <circle cx="22" cy="22" r="8" fill="rgba(255,255,255,.6)"/>
      <path d="M18 22l3 3 5-5" stroke="rgba(79,70,229,.8)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 95 Q70 60 132 30" stroke="rgba(255,255,255,.4)" strokeWidth="2" fill="none" strokeDasharray="4 3"/>
    </svg>
  ),
  tasks: (
    <svg width="130" height="100" viewBox="0 0 130 100" fill="none">
      <rect x="10" y="10" width="110" height="22" rx="8" fill="rgba(255,255,255,.3)"/>
      <circle cx="24" cy="21" r="6" fill="rgba(255,255,255,.6)"/>
      <path d="M21 21l2 2 4-4" stroke="rgba(79,70,229,.9)" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="36" y="17" width="60" height="4" rx="2" fill="rgba(255,255,255,.5)"/>
      <rect x="36" y="23" width="35" height="3" rx="1.5" fill="rgba(255,255,255,.3)"/>
      <rect x="10" y="40" width="110" height="22" rx="8" fill="rgba(255,255,255,.2)"/>
      <circle cx="24" cy="51" r="6" fill="rgba(255,255,255,.35)" stroke="rgba(255,255,255,.5)" strokeWidth="1.5"/>
      <rect x="36" y="47" width="50" height="4" rx="2" fill="rgba(255,255,255,.4)"/>
      <rect x="36" y="53" width="30" height="3" rx="1.5" fill="rgba(255,255,255,.25)"/>
      <rect x="10" y="70" width="110" height="22" rx="8" fill="rgba(255,255,255,.15)"/>
      <circle cx="24" cy="81" r="6" fill="rgba(255,255,255,.25)" stroke="rgba(255,255,255,.4)" strokeWidth="1.5"/>
      <rect x="36" y="77" width="70" height="4" rx="2" fill="rgba(255,255,255,.3)"/>
      <rect x="36" y="83" width="40" height="3" rx="1.5" fill="rgba(255,255,255,.2)"/>
      <rect x="104" y="44" width="12" height="12" rx="3" fill="rgba(255,255,255,.4)"/>
      <path d="M107 50l2 2 4-4" stroke="rgba(255,255,255,.9)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  calendar: (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
      <rect x="8" y="14" width="104" height="80" rx="10" fill="rgba(255,255,255,.2)"/>
      <rect x="8" y="14" width="104" height="26" rx="10" fill="rgba(255,255,255,.3)"/>
      <rect x="8" y="30" width="104" height="10" fill="rgba(255,255,255,.1)"/>
      <circle cx="32" cy="10" r="5" fill="rgba(255,255,255,.5)"/>
      <circle cx="88" cy="10" r="5" fill="rgba(255,255,255,.5)"/>
      <rect x="32" y="8" width="56" height="4" rx="2" fill="rgba(255,255,255,.3)"/>
      {[0,1,2,3,4,5,6].map(i=>(
        <rect key={i} x={16+i*14} y="48" width="10" height="3" rx="1.5" fill="rgba(255,255,255,.35)"/>
      ))}
      {[0,1,2,3,4,5,6].map(i=>(
        <rect key={i} x={16+i*14} y="58" width="10" height="10" rx="3"
          fill={i===2?"rgba(255,255,255,.7)":"rgba(255,255,255,.2)"}/>
      ))}
      {[0,1,2,3,4,5,6].map(i=>(
        <rect key={i} x={16+i*14} y="74" width="10" height="10" rx="3" fill="rgba(255,255,255,.15)"/>
      ))}
      <circle cx="40" cy="63" r="3" fill="rgba(79,70,229,.8)"/>
    </svg>
  ),
  pomodoro: (
    <svg width="110" height="100" viewBox="0 0 110 100" fill="none">
      <circle cx="55" cy="50" r="40" fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.3)" strokeWidth="2"/>
      <circle cx="55" cy="50" r="32" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.2)" strokeWidth="1.5"/>
      <path d="M55 18 A32 32 0 0 1 87 50" stroke="rgba(255,255,255,.8)" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <circle cx="55" cy="50" r="6" fill="rgba(255,255,255,.7)"/>
      <line x1="55" y1="50" x2="55" y2="26" stroke="rgba(255,255,255,.8)" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="55" y1="50" x2="72" y2="50" stroke="rgba(255,255,255,.6)" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="55" cy="8" r="4" fill="rgba(255,255,255,.5)"/>
      <rect x="50" y="2" width="10" height="6" rx="3" fill="rgba(255,255,255,.4)"/>
    </svg>
  ),
  settings: (
    <svg width="110" height="100" viewBox="0 0 110 100" fill="none">
      <circle cx="55" cy="50" r="22" fill="rgba(255,255,255,.15)" stroke="rgba(255,255,255,.4)" strokeWidth="2"/>
      <circle cx="55" cy="50" r="10" fill="rgba(255,255,255,.3)"/>
      {[0,45,90,135,180,225,270,315].map((a,i)=>{
        const r=28, rad=a*Math.PI/180;
        const x=55+r*Math.cos(rad), y=50+r*Math.sin(rad);
        return <circle key={i} cx={x} cy={y} r="4" fill="rgba(255,255,255,.45)"/>;
      })}
      <circle cx="55" cy="50" r="6" fill="rgba(255,255,255,.6)"/>
    </svg>
  ),
};

const CONFIGS = {
  dashboard: {
    gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #a855f7 100%)',
    title: 'Welcome back! 👋',
    subtitle: 'Here\'s your productivity overview for today.',
  },
  tasks: {
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #4f46e5 60%, #7c3aed 100%)',
    title: 'Your Tasks',
    subtitle: 'Stay organized, stay productive. Every task completed is a win.',
  },
  calendar: {
    gradient: 'linear-gradient(135deg, #10b981 0%, #0ea5e9 60%, #4f46e5 100%)',
    title: 'Calendar View',
    subtitle: 'Plan your days, visualize your schedule, never miss a deadline.',
  },
  pomodoro: {
    gradient: 'linear-gradient(135deg, #ef4444 0%, #f97316 50%, #f59e0b 100%)',
    title: 'Focus Timer 🍅',
    subtitle: '25 minutes of deep focus. One session at a time.',
  },
  settings: {
    gradient: 'linear-gradient(135deg, #64748b 0%, #4f46e5 100%)',
    title: 'Settings',
    subtitle: 'Customize your SmartTodo experience.',
  },
};

export default function PageHero({ page, children }) {
  const cfg = CONFIGS[page] || CONFIGS.dashboard;
  const ill = ILLUSTRATIONS[page];

  return (
    <div className="page-hero" style={{ background: cfg.gradient }}>
      {/* Decorative blobs */}
      <div className="hero-blob hero-blob-1" />
      <div className="hero-blob hero-blob-2" />

      <div className="hero-text">
        <h2>{cfg.title}</h2>
        <p>{cfg.subtitle}</p>
        {children && <div className="hero-children">{children}</div>}
      </div>

      {ill && <div className="hero-illustration float-anim">{ill}</div>}
    </div>
  );
}
