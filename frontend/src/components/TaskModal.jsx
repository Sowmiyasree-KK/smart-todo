import { useState, useEffect } from 'react';
import { X, Plus, Save, Loader2 } from 'lucide-react';
import { CATEGORIES, PRIORITIES } from '../utils/helpers';
import './TaskModal.css';

const EMPTY = {
  title: '', description: '', category: 'Personal', priority: 'Medium',
  due_date: '', due_time: '', reminder_time: 10, recurring: 'none',
};

export default function TaskModal({ task, onSave, onClose, saving = false }) {
  const [form,   setForm]   = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setForm({
        ...EMPTY,
        ...task,
        // Ensure numeric fields are numbers, not strings from API
        reminder_time: Number(task.reminder_time ?? EMPTY.reminder_time),
        due_date:  task.due_date  || '',
        due_time:  task.due_time  || '',
        recurring: task.recurring || 'none',
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
  }, [task]);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !saving) onClose();
  };

  return (
    <div className="modal-overlay scale-in" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2>{task ? 'Edit Task' : 'New Task'}</h2>
          <button className="modal-close" onClick={onClose} disabled={saving}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Title *</label>
            <input
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="What needs to be done?"
              autoFocus
              disabled={saving}
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Add details…"
              rows={3}
              disabled={saving}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} disabled={saving}>
                {Object.keys(CATEGORIES).map(c => (
                  <option key={c} value={c}>{CATEGORIES[c].icon} {c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select value={form.priority} onChange={e => set('priority', e.target.value)} disabled={saving}>
                {Object.keys(PRIORITIES).map(p => (
                  <option key={p} value={p}>{PRIORITIES[p].dot} {p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Due Date</label>
              <input type="date" value={form.due_date} onChange={e => set('due_date', e.target.value)} disabled={saving} />
            </div>
            <div className="form-group">
              <label>Due Time</label>
              <input type="time" value={form.due_time} onChange={e => set('due_time', e.target.value)} disabled={saving} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Reminder (mins before)</label>
              <select value={form.reminder_time} onChange={e => set('reminder_time', parseInt(e.target.value))} disabled={saving}>
                {[5, 10, 15, 30, 60].map(m => <option key={m} value={m}>{m} min</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Recurring</label>
              <select value={form.recurring} onChange={e => set('recurring', e.target.value)} disabled={saving}>
                <option value="none">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving
                ? <><Loader2 size={15} className="spin" /> Saving…</>
                : task
                  ? <><Save size={15} /> Save Changes</>
                  : <><Plus size={15} /> Add Task</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
