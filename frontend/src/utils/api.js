/**
 * API client — routes through Vite's dev proxy (/api → localhost:5000).
 * In production set VITE_API_URL to your deployed backend URL.
 */

const BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : '/api';   // proxied by Vite in dev
  console.log("API BASE =", BASE);

async function request(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body !== undefined) opts.body = JSON.stringify(body);

  let res;
  try {
    res = await fetch(`${BASE}${path}`, opts);
  } catch {
    throw new Error('Cannot reach the server. Is the backend running on port 5000?');
  }

  let data;
  try { data = await res.json(); } catch { data = {}; }

  if (!res.ok) {
    throw new Error(data?.error || `Server error ${res.status}: ${res.statusText}`);
  }
  return data;
}

export const api = {
  /* ── Tasks ── */
  getTasks:   (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v))
    ).toString();
    return request('GET', `/tasks${qs ? `?${qs}` : ''}`);
  },
  createTask: (task)     => request('POST',   '/tasks',                task),
  updateTask: (id, task) => request('PUT',    `/tasks/${id}`,          task),
  deleteTask: (id)       => request('DELETE', `/tasks/${id}`),
  toggleTask: (id)       => request('PATCH',  `/tasks/${id}/complete`),

  /* ── Sessions ── */
  getSessions:   (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v))
    ).toString();
    return request('GET', `/sessions${qs ? `?${qs}` : ''}`);
  },
  createSession: (s) => request('POST', '/sessions', s),

  /* ── Dashboard ── */
  getDashboard: () => request('GET', '/dashboard/summary'),
};
