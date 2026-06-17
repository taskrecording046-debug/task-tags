const express = require("express");
const { pool } = require("../db");
const router = express.Router();

async function attachLabels(tasks) {
  // TODO
}

// GET /api/tasks
router.get("/tasks", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, title, done, created_at FROM tasks ORDER BY id`
    );
    res.json({
      tasks: rows.map((r) => ({
        id: String(r.id),
        title: r.title,
        done: r.done,
        createdAt: r.created_at,
      })),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to load tasks." });
  }
});

// POST /api/tasks  { title }
router.post("/tasks", async (req, res) => {
  const { title } = req.body || {};
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "title is required." });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO tasks (title) VALUES ($1) RETURNING id, title, done, created_at`,
      [title.trim()]
    );
    const r = rows[0];
    res.status(201).json({
      task: { id: String(r.id), title: r.title, done: r.done, createdAt: r.created_at },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to create task." });
  }
});

// PATCH /api/tasks/:id  { done }
router.patch("/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { done } = req.body || {};
  try {
    const { rows } = await pool.query(
      `UPDATE tasks SET done = COALESCE($2, done) WHERE id = $1
       RETURNING id, title, done, created_at`,
      [id, done]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Task not found." });
    const r = rows[0];
    res.json({
      task: { id: String(r.id), title: r.title, done: r.done, createdAt: r.created_at },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to update task." });
  }
});

// DELETE /api/tasks/:id
router.delete("/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const { rowCount } = await pool.query(`DELETE FROM tasks WHERE id = $1`, [id]);
    if (rowCount === 0) return res.status(404).json({ error: "Task not found." });
    res.status(204).end();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to delete task." });
  }
});

module.exports = router;
