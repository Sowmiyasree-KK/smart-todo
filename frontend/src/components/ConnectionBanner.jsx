import { WifiOff, RefreshCw, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './ConnectionBanner.css';

export default function ConnectionBanner() {
  const { state, refetchTasks } = useApp();

  // Only show when a fetch actually failed — not when tasks list is legitimately empty
  if (!state.fetchFailed) return null;

  return (
    <div className="conn-banner" role="alert">
      <WifiOff size={15} className="conn-icon" />
      <span>
        Backend unreachable — make sure the server is running on{' '}
        <strong>port 5000</strong>, then retry.
      </span>
      <button className="conn-retry" onClick={refetchTasks} disabled={state.loading.tasks}>
        <RefreshCw size={13} className={state.loading.tasks ? 'spin' : ''} />
        {state.loading.tasks ? 'Retrying…' : 'Retry'}
      </button>
    </div>
  );
}
