import { useState, useMemo } from 'react';
import { Plus, Search, SlidersHorizontal, X, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import PageHero from '../components/PageHero';
import EmptyState from '../components/EmptyState';
import { isOverdue } from '../utils/helpers';
import './Tasks.css';

const FILTERS = ['All', 'Pending', 'Completed', 'Overdue', 'Study', 'Work', 'Personal'];
const SORTS = [
  { value: 'created',  label: 'Newest'   },
  { value: 'due_date', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'title',    label: 'Title'    },
];

export default function Tasks() {
  const { state, dispatch, refetchTasks } = useApp();
  const [modal,   setModal]  = useState(null);   // null | 'new' | task-object
  const [saving,  setSaving] = useState(false);
  const [filter,  setFilter] = useState('All');
  const [sort,    setSort]   = useState('created');
  const [search,  setSearch] = useState('');

  /* ── Filtered + sorted task list ── */
  const filtered = useMemo(() => {
    let list = [...state.tasks];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q)
      );
    }

    if      (filter === 'Overdue')   list = list.filter(t => isOverdue(t));
    else if (filter === 'Pending')   list = list.filter(t => t.status === 'Pending');
    else if (filter === 'Completed') list = list.filter(t => t.status === 'Completed');
    else if (['Study', 'Work', 'Personal'].includes(filter))
      list = list.filter(t => t.category === filter);

    const PMAP = { High: 1, Medium: 2, Low: 3 };
    if      (sort === 'due_date') list.sort((a, b) => (a.due_date || 'z') > (b.due_date || 'z') ? 1 : -1);
    else if (sort === 'priority') list.sort((a, b) => (PMAP[a.priority] || 2) - (PMAP[b.priority] || 2));
    else if (sort === 'title')    list.sort((a, b) => a.title.localeCompare(b.title));
    else                          list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return list;
  }, [state.tasks, filter, sort, search]);

  /* ── Save handler — awaits API, only closes modal on success ── */
  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (modal && modal.id) {
        await dispatch({ type: 'UPDATE_TASK', payload: { ...modal, ...form } });
      } else {
        await dispatch({ type: 'ADD_TASK', payload: form });
      }
      setModal(null);
    } catch {
      // Error already shown via toast — keep modal open so user can retry
    } finally {
      setSaving(false);
    }
  };

  const total     = state.tasks.length;
  const completed = state.tasks.filter(t => t.status === 'Completed').length;
  const isLoading = state.loading.tasks;

  return (
    <div className="page tasks-page">
      <PageHero page="tasks" />

      <div className="page-header">
        <div>
          <h1 className="page-title">My Tasks</h1>
          <p className="page-subtitle">
            {isLoading
              ? 'Loading…'
              : `${total} total · ${completed} completed · ${total - completed} remaining`}
          </p>
        </div>
        <div className="page-header-actions">
          <button
            className="btn-secondary btn-icon"
            onClick={refetchTasks}
            disabled={isLoading}
            title="Refresh tasks"
            aria-label="Refresh tasks"
          >
            <RefreshCw size={15} className={isLoading ? 'spin' : ''} />
          </button>
          <button className="btn-primary" onClick={() => setModal('new')}>
            <Plus size={16} /> New Task
          </button>
        </div>
      </div>

      {/* Search + Sort */}
      <div className="tasks-toolbar">
        <div className="search-box">
          <Search size={15} className="search-icon" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tasks…"
            className="search-input"
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>
              <X size={13} />
            </button>
          )}
        </div>
        <div className="sort-box">
          <SlidersHorizontal size={14} />
          <select value={sort} onChange={e => setSort(e.target.value)} className="sort-select">
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Filter chips */}
      <div className="filter-tabs">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="task-list stagger">
        {isLoading ? (
          /* Skeleton loading state */
          <div className="task-skeletons">
            {[1, 2, 3].map(i => <div key={i} className="task-skeleton" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            type="tasks"
            title={search ? 'No results found' : 'No tasks here'}
            message={
              search
                ? `No tasks match "${search}".`
                : 'Add a task to get started on your productivity journey.'
            }
            action={
              !search && (
                <button className="btn-primary" onClick={() => setModal('new')}>
                  <Plus size={15} /> Add Task
                </button>
              )
            }
          />
        ) : (
          filtered.map((task, i) => (
            <div key={task.id} style={{ animationDelay: `${i * 0.04}s` }}>
              <TaskCard
                task={task}
                onToggle={id => dispatch({ type: 'TOGGLE_TASK', payload: id })}
                onEdit={t => setModal(t)}
                onDelete={id => dispatch({ type: 'DELETE_TASK', payload: id })}
              />
            </div>
          ))
        )}
      </div>

      {modal && (
        <TaskModal
          task={modal === 'new' ? null : modal}
          onSave={handleSave}
          onClose={() => !saving && setModal(null)}
          saving={saving}
        />
      )}
    </div>
  );
}
