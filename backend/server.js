const express = require('express')
const cors = require('cors')
require('dotenv').config()
const bookingRoutes = require('./routes/booking')
const authRoutes = require('./routes/auth')
const pool = require('./db/db')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const morgan = require('morgan')

const app = express()
const PORT = process.env.PORT

app.use(cookieParser())
app.use(express.json())
app.use(helmet())
app.use(morgan('dev'))

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
)

app.use('/api/auth', authRoutes)
app.use('/api/bookings', bookingRoutes)

app.get('/api/health', async (req, res) => {
  try {
    const dbRes = await pool.query('SELECT NOW()')
    res.json({ ok: true, time: dbRes.rows[0].now })
  } catch {
    res.status(500).json({ ok: false })
  }
})

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Something went wrong on the server' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
