// Seed the STARTER task list with a handful of tasks.
// Run from server/:  npm run seed

const { pool } = require("../server/src/db");

const TASKS = [
  ["Write the quarterly planning doc", false],
  ["Review the API rate-limit proposal", false],
  ["Fix the flaky checkout test", true],
  ["Upgrade the build pipeline to Node 20", false],
  ["Draft the onboarding guide", false],
  ["Investigate the memory spike on workers", false],
  ["Prepare slides for the design review", true],
  ["Rotate the staging credentials", false],
  ["Clean up the unused feature flags", false],
  ["Benchmark the new cache layer", false],
];

async function main() {
  const fs = require("fs");
  const path = require("path");
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  await pool.query(schema);
  console.log("Schema created.");

  for (const [title, done] of TASKS) {
    await pool.query("INSERT INTO tasks (title, done) VALUES ($1, $2)", [title, done]);
  }
  console.log(`Inserted ${TASKS.length} tasks.`);

  await pool.end();
  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
