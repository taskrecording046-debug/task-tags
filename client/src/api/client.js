const BASE = "/api";
async function request(path, options) {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}
export const api = {
  getTasks: () => request("/tasks"),
  createTask: (title) => request("/tasks", { method: "POST", body: JSON.stringify({ title }) }),
  toggleTask: (id, done) => request(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify({ done }) }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: "DELETE" }),
};
