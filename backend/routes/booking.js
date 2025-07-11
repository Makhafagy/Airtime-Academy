const router = require('express').Router()
const pool = require('../db/db')
const nodemailer = require('nodemailer')
const { requireAuth, requireAdmin } = require('../middleware/auth.js')

router.use(requireAuth)

// Create reusable transporter object outside route handlers
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// POST /api/bookings - create a new booking
router.post('/', requireAuth, async (req, res) => {
  const { firstName, lastName, type, preferredTime, duration, notes } = req.body
  const email = req.user.email // ✅ Enforce server-side email

  if (!firstName || !lastName || !email || !type || !preferredTime || !duration) {
    return res.status(400).json({ error: 'Missing required booking fields' })
  }

  const start = new Date(preferredTime)
  const end = new Date(start.getTime() + duration * 60000)

  try {
    if (type === 'Rental') {
      const conflictQuery = `
        SELECT 1 FROM bookings
        WHERE type = 'Rental'
          AND status IN ('Pending', 'Approved', 'Confirmed')
          AND preferred_time < $1
          AND (preferred_time + (duration_minutes || ' minutes')::interval) > $2
        LIMIT 1
      `
      const conflictResult = await pool.query(conflictQuery, [end.toISOString(), start.toISOString()])
      if (conflictResult.rowCount > 0) {
        return res.status(409).json({ error: 'Time slot conflict detected for rental.' })
      }
    }

    const status = type === 'Instruction' ? 'Pending' : 'Confirmed'

    const insertQuery = `
      INSERT INTO bookings (first_name, last_name, email, type, preferred_time, duration_minutes, notes, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `
    const insertValues = [firstName, lastName, email, type, start.toISOString(), duration, notes || null, status]
    const insertResult = await pool.query(insertQuery, insertValues)
    const newBooking = insertResult.rows[0]

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.INSTRUCTOR_EMAIL,
      subject: `New ${type} Booking ${type === 'Instruction' ? 'Request' : 'Confirmation'}`,
      text: `First Name: ${firstName}
Last Name: ${lastName}
Email: ${email}
Type: ${type}
Preferred Time: ${start.toLocaleString()}
Duration: ${duration} minutes
Notes: ${notes || 'None'}
Status: ${status}`,
    })

    res.status(201).json({
      message: `Your ${type.toLowerCase()} booking ${status === 'Pending' ? 'request' : 'has been confirmed'}!`,
      booking: newBooking,
    })
  } catch (err) {
    console.error('Error creating booking:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/all', requireAdmin, async (req, res) => {
  const { status, type } = req.query
  let query = 'SELECT * FROM bookings WHERE 1=1'
  const params = []

  if (status) {
    params.push(status)
    query += ` AND status = $${params.length}`
  }
  if (type) {
    params.push(type)
    query += ` AND type = $${params.length}`
  }
  query += ' ORDER BY preferred_time DESC'

  try {
    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    console.error('❌ Error fetching bookings:', err)
    res.status(500).json({ error: err.message || 'Failed to get bookings' })
  }
})

// PATCH /api/bookings/:id - update booking status
router.patch('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params
  const { status } = req.body
  const validStatuses = ['Pending', 'Approved', 'Rejected', 'Confirmed', 'Cancelled']

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' })
  }

  const bookingId = parseInt(id)
  if (isNaN(bookingId)) {
    return res.status(400).json({ error: 'Invalid booking ID' })
  }

  try {
    const updateQuery = 'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *'
    const updateResult = await pool.query(updateQuery, [status, bookingId])

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    const updatedBooking = updateResult.rows[0]

    // Notify user about status update
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: updatedBooking.email,
      subject: `Your booking status has been updated to ${updatedBooking.status}`,
      text: `Hello ${updatedBooking.first_name} ${updatedBooking.last_name},

Your booking for ${updatedBooking.type} on ${new Date(updatedBooking.preferred_time).toLocaleString()} has been updated to "${updatedBooking.status}".

If you have any questions, please contact us.

Thank you,
Airtime Academy`,
    })

    res.json({ message: 'Booking status updated and user notified', booking: updatedBooking })
  } catch (err) {
    console.error('Error updating booking:', err)
    res.status(500).json({ error: 'Failed to update booking' })
  }
})

// GET /api/bookings/available-slots?date=YYYY-MM-DD&type=Rental
router.get('/available-slots', requireAuth, async (req, res) => {
  const { date, type } = req.query

  if (!date || !type) {
    return res.status(400).json({ error: 'Missing required query parameters: date and type' })
  }

  const openHour = 8
  const closeHour = 20
  const intervalMinutes = 15
  const durationMinutes = parseInt(req.query.duration) || 60

  const slots = []
  const dayStart = new Date(`${date}T${String(openHour).padStart(2, '0')}:00:00`)
  const dayEnd = new Date(`${date}T${String(closeHour).padStart(2, '0')}:00:00`)

  for (let t = new Date(dayStart); t < dayEnd; t.setMinutes(t.getMinutes() + intervalMinutes)) {
    slots.push(new Date(t).toISOString())
  }

  try {
    const startOfDay = new Date(`${date}T00:00:00`)
    const endOfDay = new Date(`${date}T23:59:59`)

    const conflictQuery = `
      SELECT preferred_time, duration_minutes
      FROM bookings
      WHERE type = $1
        AND preferred_time BETWEEN $2 AND $3
        AND status IN ('Pending', 'Approved', 'Confirmed')
    `
    const conflictResult = await pool.query(conflictQuery, [type, startOfDay, endOfDay])
    const bookings = conflictResult.rows

    // Filter out conflicting slots
    const availableSlots = slots.filter(slotIso => {
      const slotStart = new Date(slotIso)
      const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60000)

      return bookings.every(b => {
        const bookingStart = new Date(b.preferred_time)
        const bookingEnd = new Date(bookingStart.getTime() + b.duration_minutes * 60000)

        return slotEnd <= bookingStart || slotStart >= bookingEnd
      })
    })

    const formatted = availableSlots.map(d => {
      const date = new Date(d)
      return {
        label: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`,
        iso: date.toISOString(),
      }
    })

    res.json(formatted)
  } catch (err) {
    console.error('Error fetching available slots:', err)
    res.status(500).json({ error: 'Failed to fetch available time slots' })
  }
})

module.exports = router
