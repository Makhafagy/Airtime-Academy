const express = require('express')
const cors = require('cors')
require('dotenv').config()
const bookingRoutes = require('./routes/booking')
const pool = require('./db')

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/bookings', bookingRoutes)

// ✅ Test route for DB connection
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.json({ time: result.rows[0].now })
  } catch (err) {
    console.error(err)
    res.status(500).send('Database connection failed')
  }
})

// ✅ Single listen statement
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
