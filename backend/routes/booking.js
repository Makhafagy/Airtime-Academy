const router = require('express').Router()
const pool = require('../db')
const nodemailer = require('nodemailer')

router.post('/', async (req, res) => {
  const { name, email, type, preferredTime, duration, notes } = req.body
  const start = new Date(preferredTime)
  const end = new Date(start.getTime() + duration * 60000)

  try {
    // Conflict check only for Rental (not Instruction)
    if (type === 'Rental') {
      const conflict = await pool.query(
        `SELECT * FROM bookings
         WHERE type = 'Rental'
         AND preferred_time < $1
         AND (preferred_time + (duration_minutes || ' minutes')::interval) > $2
         AND status IN ('Pending', 'Approved', 'Confirmed')`,
        [end.toISOString(), start.toISOString()]
      )

      if (conflict.rows.length > 0) {
        return res.status(409).json({ error: 'Time slot conflict detected for rental.' })
      }
    }

    // Default status based on booking type
    const status = type === 'Instruction' ? 'Pending' : 'Confirmed'

    await pool.query(
      `INSERT INTO bookings (name, email, type, preferred_time, duration_minutes, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [name, email, type, preferredTime, duration, notes, status]
    )

    // Email notification for all bookings
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.INSTRUCTOR_EMAIL,
      subject: `New ${type} Booking ${type === 'Instruction' ? 'Request' : 'Confirmation'}`,
      text: `Name: ${name}
Email: ${email}
Type: ${type}
Preferred Time: ${preferredTime}
Duration: ${duration} minutes
Notes: ${notes || 'None'}
Status: ${status}`,
    })

    res.status(200).json({ message: `Your ${type.toLowerCase()} booking ${type === 'Instruction' ? 'request' : 'has been confirmed'}!` })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/bookings?status=Pending&type=Instruction
router.get('/all', async (req, res) => {
  const { status, type } = req.query
  let query = 'SELECT * FROM bookings WHERE 1=1'
  const params = []
  console.log('test')
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
    console.error(err)
    res.status(500).json({ error: 'Failed to get bookings' })
  }
})

// PATCH /api/bookings/:id to update status
router.patch('/:id', async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  const validStatuses = ['Pending', 'Approved', 'Rejected', 'Confirmed', 'Cancelled']

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' })
  }

  const parsedId = parseInt(id)
  if (isNaN(parsedId)) {
    return res.status(400).json({ error: 'Invalid booking ID' })
  }

  try {
    // Update booking status and get updated booking info
    const result = await pool.query('UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *', [status, parsedId])

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    const booking = result.rows[0]

    // Setup nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // Prepare email message
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: `Your booking status has been updated to ${booking.status}`,
      text: `Hello ${booking.name},

Your booking for ${booking.type} on ${new Date(booking.preferred_time).toLocaleString()} has been updated to "${booking.status}".

If you have any questions, please contact us.

Thank you,
Your Team`,
    }

    // Send the email notification
    await transporter.sendMail(mailOptions)

    res.json({ message: 'Booking status updated and user notified', booking })
  } catch (err) {
    console.log('Attempting to update booking:', id, 'to status:', status)
    console.error('Error updating booking:', err)
    res.status(500).json({ error: 'Failed to update booking' })
  }
})

module.exports = router
