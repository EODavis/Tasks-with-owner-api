# Tasks-With-Owners API

A RESTful API where every task belongs to a specific user, built with
Node.js, Express, and SQLite (via better-sqlite3). Project 8 in a
sequential backend engineering learning journey — combines authentication
(Project 7) with resource relationships and ownership-based authorization.

## Features

- User registration/login (bcrypt + JWT, reused from the Auth API)
- Every task is owned by exactly one user (`userId` foreign key)
- Users can only see, edit, or delete their own tasks
- `403 Forbidden` (not your resource) is distinguished from `401
  Unauthorized` (no valid token) and `404 Not Found` (doesn't exist)
- `ON DELETE CASCADE` — deleting a user automatically deletes their tasks
- Centralized error handling

## Tech Stack

- Node.js, Express
- better-sqlite3 (synchronous SQLite driver)
- bcrypt, jsonwebtoken, dotenv

## Getting Started

```bash
cp .env.example .env
# edit .env and set a real JWT_SECRET
npm install
npm run dev
```

Server runs on `http://localhost:3007`.

## API Endpoints

| Method | Endpoint           | Auth required  Description                       |
|--------|--------------------|--------------|-----------------------------------|
| POST   | /api/auth/register | No           | Create a new user                 |
| POST   | /api/auth/login    | No           | Log in, receive a JWT             |
| GET    | /api/tasks         | Yes          | Get the logged-in user's tasks    |
| GET    | /api/tasks/:id     | Yes          | Get one task (must be owner)      |
| POST   | /api/tasks         | Yes          | Create a task (owned by caller)   |
| PUT    | /api/tasks/:id     | Yes          | Update a task (must be owner)     |
| DELETE | /api/tasks/:id     | Yes          | Delete a task (must be owner)     |

### Accessing task routes

Authorization: Bearer < token-from-register-or-login >

## Project Structure

src/
├── config/ - Database connection, schema (users + tasks, foreign key)
├── models/ - SQL queries (async-shaped, backed by better-sqlite3)
├── controllers/ - Business logic, ownership checks (403 vs 404)
├── routes/ - URL-to-controller mapping; requireAuth applied per-router
└── middleware/ - Error handling + JWT verification

## Authorization Model

- **401** — no valid token at all (authentication failure)
- **403** — valid token, but the task belongs to someone else (authorization failure)
- **404** — the task simply doesn't exist

## Notes

Originally attempted with `sqlite3`/`sqlite`, but switched to
`better-sqlite3` due to missing precompiled native bindings for a
newer Node.js version. The model layer still exposes an async API
so the rest of the app (controllers, routes) required no changes.
