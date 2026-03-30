import { useMemo } from 'react';
import { CheckCircle2, Clock, AlertCircle, ListTodo, Flame, Timer, TrendingUp, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useApp } from '../context/AppContext';
import { isOverdue, getLast7Days, getDayLabel, CATEGORIES } from '../utils/helpers';
import PageHero from '../components/PageHero';
import EmptyState from '../components/EmptyState';
import './Dashboard.css';

const CAT_COLORS = { Study: '#7c3aed', Work: '#4f46e5', Personal: '#10b981' };

const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Small daily improvements lead to stunning results.", author: "Robin Sharma" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "Your future is created by what you do today.", author: "Robert Kiyosaki" },
];

export default function Dashboard() {
  const { state } = useApp();
  const { tasks, sessions } = state;
  const isLoading = state.loading.tasks;

  const quote = QUOTES[new Date().getDate() % QUOTES.length];

  const stats = useMemo(() => {
    const total     = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const pending   = tasks.filter(t => t.status === 'Pending').length;
    const overdue   = tasks.filter(t => isOverdue(t)).length;
    const rate      = total ? Math.round((completed / total) * 100) : 0;
    const totalSessions = sessions.reduce((s, x) => s + (x.completed_sessions || 1), 0);

    const days = getLast7Days();
    const weekly = days.map(date => ({
      day: getDayLabel(date),
      Completed: tasks.filter(t => t.completed_at && t.completed_at.startsWith(date)).length,
      Added:     tasks.filter(t => t.created_at  && t.created_at.startsWith(date)).length,
    }));

    const catData = Object.keys(CATEGORIES).map(cat => ({
      name: cat, color: CAT_COLORS[cat],
      value:     tasks.filter(t => t.category === cat).length,
      completed: tasks.filter(t => t.category === cat && t.status === 'Completed').length,
    })).filter(c => c.value > 0);

    const streak = (() => {
      const dateSet = new Set(tasks.filter(t => t.completed_at).map(t => t.completed_at.split('T')[0]));
      let s = 0; const d = new Date();
      while (true) {
        if (!dateSet.has(d.toISOString().split('T')[0])) break;
        s++; d.setDate(d.getDate() - 1);
      }
      return s;
    })();

    return { total, completed, pending, overdue, rate, totalSessions, weekly, catData, streak };
  }, [tasks, sessions]);

  const STAT_CARDS = [
    { label: 'Total Tasks',  value: stats.total,         icon: ListTodo,     grad: 'linear-gradient(135deg,#4f46e5,#7c3aed)', shadow: 'rgba(79,70,229,.3)' },
    { label: 'Completed',    value: stats.completed,     icon: CheckCircle2, grad: 'linear-gradient(135deg,#10b981,#06b6d4)', shadow: 'rgba(16,185,129,.3)' },
    { label: 'Pending',      value: stats.pending,       icon: Clock,        grad: 'linear-gradient(135deg,#f59e0b,#f97316)', shadow: 'rgba(245,158,11,.3)' },
    { label: 'Overdue',      value: stats.overdue,       icon: AlertCircle,  grad: 'linear-gradient(135deg,#ef4444,#ec4899)', shadow: 'rgba(239,68,68,.3)' },
    { label: 'Day Streak',   value: `${stats.streak}d`,  icon: Flame,        grad: 'linear-gradient(135deg,#f97316,#f59e0b)', shadow: 'rgba(249,115,22,.3)' },
    { label: 'Pomodoros',    value: stats.totalSessions, icon: Timer,        grad: 'linear-gradient(135deg,#7c3aed,#a855f7)', shadow: 'rgba(124,58,237,.3)' },
  ];

  const tooltipStyle = {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 10, fontSize: 12, color: 'var(--text)',
    boxShadow: 'var(--shadow)',
  };

  return (
    <div className="page dashboard-page">
      <PageHero page="dashboard">
        <div className="hero-stats-row">
          <div className="hero-stat"><span className="hs-val">{isLoading ? '…' : `${stats.rate}%`}</span><span className="hs-lbl">Done</span></div>
          <div className="hero-stat-div"/>
          <div className="hero-stat"><span className="hs-val">{isLoading ? '…' : stats.streak}</span><span className="hs-lbl">Streak</span></div>
          <div className="hero-stat-div"/>
          <div className="hero-stat"><span className="hs-val">{isLoading ? '…' : stats.totalSessions}</span><span className="hs-lbl">Pomodoros</span></div>
        </div>
      </PageHero>

      {/* Stat Cards */}
      <div className="stat-grid stagger">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="stat-card">
                <div className="stat-card-inner stat-skeleton" style={{ minHeight: 90 }} />
                <div className="stat-label-skeleton" />
              </div>
            ))
          : STAT_CARDS.map(({ label, value, icon: Icon, grad, shadow }, i) => (
          <div key={label} className="stat-card fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="stat-card-inner" style={{ background: grad, boxShadow: `0 8px 20px ${shadow}` }}>
              <div className="stat-icon-wrap"><Icon size={22} /></div>
              <div className="stat-val">{value}</div>
            </div>
            <div className="stat-label">{label}</div>
          </div>
          ))}
      </div>

      {/* Progress + Quote row */}
      <div className="dash-mid-row">
        <div className="progress-card fade-in">
          <div className="progress-header">
            <div>
              <span className="progress-title">Overall Completion</span>
              <p className="progress-sub">{stats.completed} of {stats.total} tasks done</p>
            </div>
            <div className="progress-ring-wrap">
              <svg width="64" height="64" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" fill="none" stroke="var(--surface2)" strokeWidth="6"/>
                <circle cx="32" cy="32" r="26" fill="none"
                  stroke="url(#progGrad)" strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={`${2*Math.PI*26}`}
                  strokeDashoffset={`${2*Math.PI*26*(1-stats.rate/100)}`}
                  transform="rotate(-90 32 32)"
                  style={{ transition: 'stroke-dashoffset .8s ease' }}
                />
                <defs>
                  <linearGradient id="progGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4f46e5"/>
                    <stop offset="100%" stopColor="#7c3aed"/>
                  </linearGradient>
                </defs>
              </svg>
              <span className="ring-pct">{stats.rate}%</span>
            </div>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${stats.rate}%` }}/>
          </div>
          <div className="progress-labels">
            <span className="pl-done">✅ {stats.completed} completed</span>
            <span className="pl-left">⏳ {stats.pending} remaining</span>
          </div>
        </div>

        <div className="quote-card fade-in">
          <div className="quote-icon"><Star size={18} /></div>
          <blockquote className="quote-text">"{quote.text}"</blockquote>
          <cite className="quote-author">— {quote.author}</cite>
          <div className="quote-decoration"/>
        </div>
      </div>

      {/* Charts */}
      {tasks.length === 0 ? (
        <EmptyState type="default" title="No data yet" message="Add tasks to see your productivity charts." />
      ) : (
        <div className="charts-grid">
          <div className="chart-card fade-in">
            <div className="chart-header">
          <h3 className="chart-title">Weekly Activity</h3>
              <div className="chart-legend">
                <span><span className="legend-dot" style={{ background: '#4f46e5' }}/>Completed</span>
                <span><span className="legend-dot" style={{ background: '#a5b4fc' }}/>Added</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={stats.weekly} barSize={11} barGap={3}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} allowDecimals={false} width={22}/>
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--surface2)', radius: 4 }}/>
                <Bar dataKey="Completed" fill="#4f46e5" radius={[5,5,0,0]}/>
                <Bar dataKey="Added"     fill="#a5b4fc" radius={[5,5,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card fade-in">
            <div className="chart-header">
              <h3 className="chart-title">By Category</h3>
            </div>
            {stats.catData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={170}>
                  <PieChart>
                    <Pie data={stats.catData} dataKey="value" nameKey="name"
                      cx="50%" cy="50%" outerRadius={72} innerRadius={40}
                      paddingAngle={3}>
                      {stats.catData.map((c, i) => <Cell key={i} fill={c.color}/>)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="chart-legend chart-legend-center">
                  {stats.catData.map(c => (
                    <span key={c.name}>
                      <span className="legend-dot" style={{ background: c.color }}/>
                      {CATEGORIES[c.name].icon} {c.name} ({c.value})
                    </span>
                  ))}
                </div>
              </>
            ) : <EmptyState type="default" title="No categories" message="Add tasks to see breakdown."/>}
          </div>
        </div>
      )}

      {/* Category breakdown */}
      {stats.catData.length > 0 && (
        <div className="cat-breakdown fade-in">
          <h3 className="chart-title">Category Progress</h3>
          <div className="cat-list">
            {stats.catData.map(c => (
              <div key={c.name} className="cat-row">
                <div className="cat-info">
                  <div className="cat-icon-badge" style={{ background: c.color + '22', color: c.color }}>
                    {CATEGORIES[c.name].icon}
                  </div>
                  <span className="cat-name">{c.name}</span>
                  <span className="cat-pct">{c.value ? Math.round((c.completed/c.value)*100) : 0}%</span>
                  <span className="cat-count">{c.completed}/{c.value}</span>
                </div>
                <div className="cat-bar-bg">
                  <div className="cat-bar-fill" style={{
                    width: `${c.value ? (c.completed/c.value)*100 : 0}%`,
                    background: c.color,
                  }}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
