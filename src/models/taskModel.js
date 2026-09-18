const { getDb } = require('../config/db');

async function getTasksByUserId(userId) {
  const db = getDb();
  return db.prepare('SELECT * FROM tasks WHERE userId = ? ORDER BY id').all(userId);
}

async function getTaskById(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
}

async function createTask({ title, userId }) {
  const db = getDb();
  const createdAt = new Date().toISOString();

  const result = db
    .prepare('INSERT INTO tasks (title, completed, userId, createdAt) VALUES (?, 0, ?, ?)')
    .run(title, userId, createdAt);

  return getTaskById(result.lastInsertRowid);
}

async function updateTask(id, updates) {
  const existing = await getTaskById(id);
  if (!existing) return null;

  const title = updates.title !== undefined ? updates.title : existing.title;
  const completed = updates.completed !== undefined ? (updates.completed ? 1 : 0) : existing.completed;

  const db = getDb();
  db.prepare('UPDATE tasks SET title = ?, completed = ? WHERE id = ?').run(title, completed, id);

  return getTaskById(id);
}

async function deleteTask(id) {
  const db = getDb();
  const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  return result.changes > 0;
}

module.exports = { getTasksByUserId, getTaskById, createTask, updateTask, deleteTask };