const express = require('express')
const cors = require('cors')

const app = express()

const authRoutes = require('./src/routes/authRoutes')
const categoryRoutes = require('./src/routes/categoryRoutes')
const productsRoutes = require('./src/routes/productsRoutes')

// Middleware
app.use(cors())
app.use(express.json()) // Allows Express to read JSON data from the frontend

// Handle malformed JSON body errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON payload format' })
  }
  next(err)
})

// Route Handlers
app.use('/api/auth', authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productsRoutes)

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is running' })
})

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// General Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err)
  res.status(500).json({ message: 'Internal server error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
