const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { findUserByEmail, createUser, getUserById } = require('../models/userModel.js')
const { requireAuth } = require('../middleware/auth.js')

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Enable in production
  sameSite: 'strict',
}

// Register
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    const existing = await findUserByEmail(email)
    if (existing) return res.status(400).json({ message: 'Email already exists' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await createUser(firstName, lastName, email, hashedPassword)

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' })
    res.cookie('token', token, COOKIE_OPTIONS)
    res.json({ user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Registration error' })
  }
})

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await findUserByEmail(email)
    if (!user) return res.status(400).json({ message: 'Invalid email or password' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' })

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' })
    res.cookie('token', token, COOKIE_OPTIONS)
    res.json({ user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Login error' })
  }
})

router.post('/logout', (req, res) => {
  const { maxAge, ...cookieOptionsWithoutMaxAge } = COOKIE_OPTIONS
  res.clearCookie('token', cookieOptionsWithoutMaxAge)
  res.json({ message: 'Logged out' })
})

// Authenticated user info
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await getUserById(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error fetching user' })
  }
})

module.exports = router
