CREATE TABLE IF NOT EXISTS labels (
    id  BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#64748b',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_labels_name_lower ON labels (lower(name));

CREATE TABLE IF NOT EXISTS task_labels (
    task_id BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    label_id BIGINT NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, label_id)
);
CREATE INDEX IF NOT EXISTS idx_task_labels_label_id ON task_labels (label_id);