const express = require('express')
const router = express.Router()
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController')
const { protect } = require('../middleware/authMiddleware')
const {
  validateIdParam,
  validateProductQuery,
  validateCreateProduct,
  validateUpdateProduct
} = require('../middleware/validateMiddleware')

// Product Routes with Auth & Validation
router.get('/', protect, validateProductQuery, getProducts)
router.post('/', protect, validateCreateProduct, createProduct)
router.put('/:id', protect, validateIdParam, validateUpdateProduct, updateProduct)
router.delete('/:id', protect, validateIdParam, deleteProduct)

module.exports = router