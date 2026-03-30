import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import PageHero from '../components/PageHero';
import EmptyState from '../components/EmptyState';
import { CATEGORIES } from '../utils/helpers';
import './Calendar.css';

const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function Calendar() {
  const { state, dispatch } = useApp();
  const today = new Date();
  const [current,  setCurrent]  = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selected, setSelected] = useState(today.toISOString().split('T')[0]);
  const [modal,    setModal]    = useState(null);
  const [saving,   setSaving]   = useState(false);

  const { year, month } = current;
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr    = today.toISOString().split('T')[0];

  const tasksByDate = useMemo(() => {
    const map = {};
    state.tasks.forEach(t => {
      if (t.due_date) { (map[t.due_date] = map[t.due_date] || []).push(t); }
    });
    return map;
  }, [state.tasks]);

  const selectedTasks = tasksByDate[selected] || [];

  const prev = () => setCurrent(c => c.month === 0  ? { year:c.year-1, month:11 } : { ...c, month:c.month-1 });
  const next = () => setCurrent(c => c.month === 11 ? { year:c.year+1, month:0  } : { ...c, month:c.month+1 });

  const handleSave = async (form) => {
    const payload = { ...form, due_date: selected };
    setSaving(true);
    try {
      if (modal && modal.id) {
        await dispatch({ type: 'UPDATE_TASK', payload: { ...modal, ...payload } });
      } else {
        await dispatch({ type: 'ADD_TASK', payload });
      }
      setModal(null);
    } catch {
      // Error shown via toast — keep modal open
    } finally {
      setSaving(false);
    }
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="page calendar-page">
      <PageHero page="calendar"/>

      <div className="page-header">
        <div>
          <h1 className="page-title">Calendar</h1>
          <p className="page-subtitle">View and manage tasks by date</p>
        </div>
        <button className="btn-primary" onClick={() => setModal('new')}><Plus size={16}/> Add Task</button>
      </div>

      <div className="calendar-layout">
        {/* Calendar grid */}
        <div className="calendar-panel">
          <div className="cal-nav">
            <button className="cal-nav-btn" onClick={prev}><ChevronLeft size={17}/></button>
            <h2 className="cal-month">{MONTHS[month]} {year}</h2>
            <button className="cal-nav-btn" onClick={next}><ChevronRight size={17}/></button>
          </div>

          <div className="cal-grid">
            {DAYS.map(d => <div key={d} className="cal-day-hdr">{d}</div>)}
            {cells.map((day, i) => {
              if (!day) return <div key={`e-${i}`} className="cal-cell empty"/>;
              const ds = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
              const dt = tasksByDate[ds] || [];
              const isToday    = ds === todayStr;
              const isSelected = ds === selected;
              return (
                <div key={day}
                  className={`cal-cell ${isToday?'today':''} ${isSelected?'selected':''} ${dt.length?'has-tasks':''}`}
                  onClick={() => setSelected(ds)}>
                  <span className="cal-day-num">{day}</span>
                  {dt.length > 0 && (
                    <div className="cal-dots">
                      {dt.slice(0,3).map((t,idx) => (
                        <span key={idx} className="cal-dot" style={{ background: CATEGORIES[t.category]?.color || '#4f46e5' }}/>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Side panel */}
        <div className="cal-tasks-panel">
          <div className="cal-tasks-header">
            <div>
              <h3 className="cal-selected-date">
                {new Date(selected+'T00:00:00').toLocaleDateString('en-US',{ weekday:'long', month:'long', day:'numeric' })}
              </h3>
              {selected === todayStr && <span className="today-chip">Today</span>}
            </div>
            <span className="task-count-badge">{selectedTasks.length} task{selectedTasks.length!==1?'s':''}</span>
          </div>

          <div className="cal-task-list">
            {selectedTasks.length === 0 ? (
              <EmptyState
                type="calendar"
                title="No tasks this day"
                message="Click a date and add a task to plan your schedule."
                action={<button className="btn-outline" onClick={() => setModal('new')}><Plus size={13}/> Add task</button>}
              />
            ) : (
              selectedTasks.map(task => (
                <TaskCard key={task.id} task={task}
                  onToggle={id => dispatch({ type:'TOGGLE_TASK', payload:id })}
                  onEdit={t => setModal(t)}
                  onDelete={id => dispatch({ type:'DELETE_TASK', payload:id })}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {modal && (
        <TaskModal task={modal==='new'?null:modal} onSave={handleSave} onClose={() => !saving && setModal(null)} saving={saving}/>
      )}
    </div>
  );
}
