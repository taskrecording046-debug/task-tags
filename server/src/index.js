// Task List API server — STARTER.
const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/tasks");
const labelRoutes = require("./routes/labels");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/api", taskRoutes);
app.use("/api", taskRoulabelRoutestes);
app.get("/api/health", (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Task List API listening on http://localhost:${PORT}`);
});
