const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

function requireAuth(req, res, next) {
  const token = req.cookies?.token
  if (!token) return res.status(401).json({ message: 'No token provided' })

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' })
    }
    return res.status(401).json({ message: 'Invalid token' })
  }
}

const requireAdmin = (req, res, next) => {
  const user = req.user
  if (user && user.role === 'admin') {
    next()
  } else {
    res.status(403).json({ error: 'Forbidden: Admins only' })
  }
}

module.exports = { requireAuth, requireAdmin }
