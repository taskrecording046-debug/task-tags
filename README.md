# Task List — Starter

A minimal todo list (React + Express + PostgreSQL): list tasks, add, toggle
done, delete. This is the STARTER for a tutorial that adds a **tagging
system with filtering** on top of it.

## Requirements

- Node.js 18+, PostgreSQL 14+ (macOS: `brew install node postgresql@16`)

## Setup

```bash
createdb tasks
cd server
npm install
PGUSER=postgres PGDATABASE=tasks npm run seed
PGUSER=postgres PGDATABASE=tasks npm start    # http://localhost:4000

cd client
npm install && npm run dev                     # http://localhost:5173
```

## What's here

```
task-tags/
├── db/
│   ├── schema.sql   # tasks
│   └── seed.js      # 10 sample tasks
├── server/          # Express + pg (port 4000)
│   └── src/routes/tasks.js   # list / create / toggle / delete
└── client/          # React + Vite (port 5173)
    └── src/App.jsx  # task list UI
```

The tutorial adds: a `labels` table and `task_labels` join table, label
CRUD + assign/unassign endpoints, label chips in the UI, and filtering
tasks by labels (match-any / match-all).
