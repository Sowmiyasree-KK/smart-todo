import { useState } from 'react';
import { Check, Edit2, Trash2, Clock, AlertCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { CATEGORIES, PRIORITIES, formatDate, formatTime, isOverdue, isDueToday } from '../utils/helpers';
import './TaskCard.css';

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const [exiting,  setExiting]  = useState(false);
  const [flashing, setFlashing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const cat      = CATEGORIES[task.category] || CATEGORIES.Personal;
  const pri      = PRIORITIES[task.priority]  || PRIORITIES.Medium;
  const overdue  = isOverdue(task);
  const dueToday = isDueToday(task);
  const done     = task.status === 'Completed';

  const handleToggle = () => {
    if (!done) { setFlashing(true); setTimeout(() => setFlashing(false), 500); }
    onToggle(task.id);
  };

  const handleDelete = () => {
    setExiting(true);
    setTimeout(() => onDelete(task.id), 270);
  };

  const cls = ['task-card',
    done     ? 'done'     : '',
    overdue  ? 'overdue'  : '',
    flashing ? 'task-complete-flash' : '',
    exiting  ? 'task-exit' : 'fade-in-up',
  ].filter(Boolean).join(' ');

  return (
    <div className={cls}>
      {/* Colored left stripe */}
      <div className="tc-stripe" style={{ background: pri.color }}/>

      {/* Checkbox */}
      <button className={`tc-check ${done ? 'checked' : ''}`} onClick={handleToggle}
        aria-label={done ? 'Mark pending' : 'Mark complete'}>
        {done && <Check size={11} strokeWidth={3.5}/>}
      </button>

      {/* Body */}
      <div className="tc-body">
        <div className="tc-top">
          <h3 className={`tc-title ${done ? 'done-text' : ''}`}>{task.title}</h3>
          <div className="tc-badges">
            <span className="tc-badge" style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.color}22` }}>
              {cat.icon} {cat.label}
            </span>
            <span className="tc-badge tc-pri" style={{ background: pri.bg, color: pri.color, border: `1px solid ${pri.color}22` }}>
              {pri.dot} {pri.label}
            </span>
            {task.recurring !== 'none' && (
              <span className="tc-badge tc-recur">
                <RefreshCw size={9}/> {task.recurring}
              </span>
            )}
          </div>
        </div>

        {task.description && (
          <div className={`tc-desc-wrap ${expanded ? 'open' : ''}`}>
            <p className="tc-desc">{task.description}</p>
          </div>
        )}

        <div className="tc-footer">
          <div className="tc-meta">
            {task.due_date && (
              <span className={`tc-meta-item ${overdue ? 'danger' : dueToday ? 'warn' : ''}`}>
                {overdue ? <AlertCircle size={12}/> : <Clock size={12}/>}
                {overdue ? 'Overdue · ' : dueToday ? 'Today · ' : ''}
                {formatDate(task.due_date)}
                {task.due_time && ` · ${formatTime(task.due_time)}`}
              </span>
            )}
          </div>
          {task.description && (
            <button className="tc-expand" onClick={() => setExpanded(e => !e)}>
              {expanded ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
            </button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="tc-actions">
        <button className="tc-btn tc-edit"   onClick={() => onEdit(task)}  aria-label="Edit"><Edit2 size={13}/></button>
        <button className="tc-btn tc-delete" onClick={handleDelete}        aria-label="Delete"><Trash2 size={13}/></button>
      </div>
    </div>
  );
}
