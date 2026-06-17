const express = require("express");
const { pool } = require("../db");
const router = express.Router();

router.get("/labels", async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT l.id, l.name, l.color, COUNT(tl.task_id)::int AS task_count
            FROM labels l
            LEFT JOIN task_labels tl on tl.label_id = l.id
            GROUP BY l.id ORDER BY l.name`);
        res.json({ labels:rows.map((r) => ({
            id: String(r.id), name: r.name, color: r.color, taskCount: r.task_count })) });     
    } catch (err) { console.error(err.message); res.status(500).json({ error: "Failed to load labels." }); }
});

router.post("/labels", async (req, res) => {
    const { name, color } = req.body || {};
    if (!name || !name.trim()) return res.status(400).json({ error: "name is required." });
    try {
        const { rows } = await pool.query(
            `INSERT INTO labels (name, color) VALUES ($1, COALESCE($2, '#64748b))
            RETURNING id, name, color,`, [name.trim(), color]
        );
        const r = rows[0];
        res.status(201).json({ label: { id: String(r.id), name: r.name, color: r.color, taskCount: 0 } });
    } catch (err) {
        if (err.code === "23505") return res.status(409).json({ error: "A label with that name already exists." });
        console.error(err.message); res.status(500).json({ error: "Failed to create label." });
    }
})

router.delete("/labels/:id", async (req, res) => {
    try {
        const { rowCount } = await pool.query(`DELETE FROM labels WHERE id = $1`, [Number(req.params.id)]);
        if (rowCount === 0) return res.status(404).json({ error: "Label not found" });
        res.status(204).end()
    } catch (err) { console.error(err.message); res.status(500).json({ error: "Failed to delete label." }); }
})

module.exports = router;