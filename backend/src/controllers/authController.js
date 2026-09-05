const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../config/db')

exports.login = async (req, res) => {
  const { email, password } = req.body

  try {
    // 1. Find user by email
    const user = await db('users').where({ email }).first()
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // 2. Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // 3. Generate JWT Token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'super_secret_gmart_key_2026',
      { expiresIn: '8h' }
    )

    // 4. Send token to frontend
    res.json({ token, user: { name: user.name, email: user.email } })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.getMe = async (req, res) => {
  try {
    const user = await db('users')
      .where({ id: req.user.id })
      .select('id', 'name', 'email')
      .first()

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error verifying user' })
  }
}

