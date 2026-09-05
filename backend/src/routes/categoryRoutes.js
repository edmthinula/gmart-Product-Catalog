const express = require('express')
const router = express.Router()
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController')
const { protect } = require('../middleware/authMiddleware')
const {
  validateIdParam,
  validateCreateCategory,
  validateUpdateCategory
} = require('../middleware/validateMiddleware')

// Category Routes with Auth & Validation
router.get('/', protect, getCategories)
router.post('/', protect, validateCreateCategory, createCategory)
router.put('/:id', protect, validateIdParam, validateUpdateCategory, updateCategory)
router.delete('/:id', protect, validateIdParam, deleteCategory)

module.exports = router
