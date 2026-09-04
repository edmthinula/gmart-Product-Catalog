const express = require('express')
const cors = require('cors')

const app = express()

const authRoutes = require('./src/routes/authRoutes')
const categoryRoutes = require('./src/routes/categoryRoutes')

// Middleware
app.use(cors())
app.use(express.json()) // Allows Express to read JSON data from the frontend
app.use('/api/auth', authRoutes)
app.use('/api/categories', categoryRoutes)

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is running' })
})

const PORT = 5000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
