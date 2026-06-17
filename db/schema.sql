-- Task list — STARTER schema.
-- A plain todo list: tasks with a title and a done flag. No tags yet — the
-- tutorial adds the tagging system on top of this.

DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
  id         BIGSERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  done       BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
