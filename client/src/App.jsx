import { useEffect, useState } from "react";
import { api } from "./api/client";

export default function App() {
  const [tasks, setTasks] = useState(null);
  const [error, setError] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    api.getTasks().then((d) => setTasks(d.tasks)).catch((e) => setError(e.message));
  }, []);

  async function addTask() {
    const title = newTitle.trim();
    if (!title) return;
    try {
      const { task } = await api.createTask(title);
      setTasks((prev) => [...prev, task]);
      setNewTitle("");
    } catch (e) {
      setError(e.message);
    }
  }

  async function toggle(task) {
    try {
      const { task: updated } = await api.toggleTask(task.id, !task.done);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (e) {
      setError(e.message);
    }
  }

  async function remove(task) {
    try {
      await api.deleteTask(task.id);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    } catch (e) {
      setError(e.message);
    }
  }

  if (error) return <div className="state error">{error}</div>;
  if (!tasks) return <div className="state">Loading…</div>;

  const remaining = tasks.filter((t) => !t.done).length;

  return (
    <div className="page">
      <header className="head">
        <p className="eyebrow">PERSONAL · TODO</p>
        <h1>Task List</h1>
        <p className="sub">{remaining} remaining of {tasks.length}</p>
      </header>

      <div className="add-row">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a task…"
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul className="list">
        {tasks.map((t) => (
          <li key={t.id} className={`task ${t.done ? "task-done" : ""}`}>
            <label className="task-main">
              <input type="checkbox" checked={t.done} onChange={() => toggle(t)} />
              <span className="task-title">{t.title}</span>
            </label>
            <button className="del" onClick={() => remove(t)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
