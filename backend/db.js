const { Pool } = require('pg')

// Use environment variables for sensitive info like this:
const pool = new Pool({
  user: process.env.PG_USER,           // e.g. 'postgres'
  host: process.env.PG_HOST,           // e.g. 'localhost'
  database: process.env.PG_DATABASE,   // e.g. 'airtime_academy'
  password: process.env.PG_PASSWORD,   // your db password
  port: process.env.PG_PORT || 5433,
})

module.exports = pool
