const express = require('express')
const cors = require('cors')
require('dotenv').config()
const bookingRoutes = require('./routes/booking')
const authRoutes = require('./routes/auth')
const pool = require('./db')
const cookieParser = require('cookie-parser')

const app = express()

app.use(cookieParser())
app.use(express.json())

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
)

app.use('/api/auth', authRoutes)
app.use('/api/bookings', bookingRoutes)

app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.json({ time: result.rows[0].now })
  } catch (err) {
    console.error(err)
    res.status(500).send('Database connection failed')
  }
})

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
