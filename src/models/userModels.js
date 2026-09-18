const { getDb } = require('../config/db');

async function getUserByEmail(email) {
  const db = getDb();
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
}

async function getUserById(id) {
  const db = getDb();
  return db.prepare('SELECT id, username, email, createdAt FROM users WHERE id = ?').get(id);
}

async function createUser({ username, email, passwordHash }) {
  const db = getDb();
  const createdAt = new Date().toISOString();

  const result = db
    .prepare('INSERT INTO users (username, email, passwordHash, createdAt) VALUES (?, ?, ?, ?)')
    .run(username, email, passwordHash, createdAt);

  return getUserById(result.lastInsertRowid);
}

module.exports = { getUserByEmail, getUserById, createUser };