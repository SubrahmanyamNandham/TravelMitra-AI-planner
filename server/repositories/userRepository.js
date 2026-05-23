const { db } = require('../db');

const mapUser = (row) =>
  row
    ? {
        id: row.id,
        name: row.name,
        email: row.email,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }
    : null;

exports.createUser = async ({ name, email, password }) => {
  const [user] = await db('users')
    .insert({ name, email, password })
    .returning(['id', 'name', 'email', 'created_at', 'updated_at']);
  return mapUser(user);
};

exports.findUserByEmail = async (email) => {
  const row = await db('users').where({ email }).first();
  return mapUser(row);
};

exports.findUserById = async (userId) => {
  const row = await db('users').where({ id: userId }).first();
  return mapUser(row);
};

exports.existsByEmail = async (email) => {
  const row = await db('users').where({ email }).first();
  return Boolean(row);
};
