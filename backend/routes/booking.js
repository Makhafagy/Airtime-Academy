const express = require('express');
const router = express.Router();
const pool = require('../db');
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
  const { name, email, type, preferredTime, duration, notes } = req.body;
  const start = new Date(preferredTime);
  const end = new Date(start.getTime() + duration * 60000);

  try {
    const conflict = await pool.query(
      `SELECT * FROM bookings
       WHERE type = $1 AND
       preferred_time < $2 AND
       (preferred_time + (duration_minutes || ' minutes')::interval) > $3
       AND status IN ('Pending', 'Approved', 'Confirmed')`,
      [type, end.toISOString(), start.toISOString()]
    );

    if (conflict.rows.length > 0) {
      return res.status(409).json({ error: 'Time slot conflict detected' });
    }

    await pool.query(
      `INSERT INTO bookings (name, email, type, preferred_time, duration_minutes, notes)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, email, type, preferredTime, duration, notes]
    );

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.INSTRUCTOR_EMAIL,
      subject: `New ${type} Booking Request`,
      text: `Name: ${name}
Email: ${email}
Type: ${type}
Preferred Time: ${preferredTime}
Duration: ${duration} minutes
Notes: ${notes || 'None'}`,
    });

    res.status(200).json({ message: 'Booking submitted!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;