const { pool } = require("../server/src/db");

const LABELS = [
  ["urgent", "#dc2626"],
  ["docs", "#2563eb"],
  ["infra", "#7c3aed"],
  ["testing", "#059669"],
  ["chore", "#64748b"],
];
const ATTACH = [
  ["planning doc", ["docs", "urgent"]],
  ["rate-limit", ["infra"]],
  ["checkout test", ["testing", "urgent"]],
  ["build pipeline", ["infra", "chore"]],
  ["onboarding guide", ["docs"]],
  ["memory spike", ["infra", "urgent"]],
  ["design review", ["docs"]],
  ["staging credentials", ["infra", "chore"]],
  ["feature flags", ["chore"]],
  ["cache layer", ["infra", "testing"]],
];

async function main() {
  const labelId = {};
  for (const [name, color] of LABELS) {
    const { rows } = await pool.query(
      `INSERT INTO labels (name, color) VALUES ($1, $2)
       ON CONFLICT (lower(name)) DO UPDATE SET color = EXCLUDED.color
       RETURNING id, name`,
      [name, color],
    );
    labelId[rows[0].name] = rows[0].id;
  }
  for (const [needle, names] of ATTACH) {
    const { rows: tasks } = await pool.query(
      `SELECT id FROM tasks WHERE title ILIKE $1`,
      [`%${needle}%`],
    );
    for (const t of tasks)
      for (const name of names)
        await pool.query(
          `INSERT INTO task_labels (task_id, label_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [t.id, labelId[name]],
        );
  }
  await pool.end();
  console.log("Label seed complete.");
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
