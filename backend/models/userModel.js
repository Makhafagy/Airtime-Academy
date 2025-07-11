const pool = require('../db/db')

const findUserByEmail = async email => {
  const res = await pool.query('SELECT * FROM users WHERE email = $1', [email])
  return res.rows[0]
}

const createUser = async (firstName, lastName, email, hashedPassword) => {
  const res = await pool.query('INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *', [
    firstName,
    lastName,
    email,
    hashedPassword,
  ])
  return res.rows[0]
}

const getUserById = async id => {
  const res = await pool.query('SELECT id, first_name, last_name, email, role FROM users WHERE id = $1', [id])
  return res.rows[0]
}

module.exports = {
  findUserByEmail,
  createUser,
  getUserById,
}
