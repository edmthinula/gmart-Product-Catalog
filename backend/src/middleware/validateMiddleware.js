const {
  isPositiveInteger,
  isNonNegativeInteger,
  isNonNegativeFloat,
  isNonEmptyString
} = require('../utils/validation')

/**
 * Middleware to validate :id route parameter.
 * Ensures the ID is a valid positive full number (integer > 0).
 */
const validateIdParam = (req, res, next) => {
  const { id } = req.params

  if (!isPositiveInteger(id)) {
    return res.status(400).json({
      message: 'Invalid ID: must be a positive full number (integer)'
    })
  }

  req.params.id = parseInt(id, 10)
  next()
}

/**
 * Middleware to validate product list query parameters (pagination).
 * Ensures `page` and `limit` are positive full numbers (integers >= 1).
 */
const validateProductQuery = (req, res, next) => {
  const { page, limit } = req.query

  if (page !== undefined && page !== '') {
    if (!isPositiveInteger(page)) {
      return res.status(400).json({
        message: 'Invalid page: must be a positive full number (integer >= 1)'
      })
    }
    req.query.page = parseInt(page, 10)
  }

  if (limit !== undefined && limit !== '') {
    if (!isPositiveInteger(limit) || parseInt(limit, 10) > 100) {
      return res.status(400).json({
        message:
          'Invalid limit: must be a positive full number (integer between 1 and 100)'
      })
    }
    req.query.limit = parseInt(limit, 10)
  }

  next()
}

/**
 * Middleware to validate product creation payload.
 * - name: required non-empty string
 * - category_id: required positive integer (full number > 0)
 * - price: required non-negative float (decimal number >= 0, max 2 decimals)
 * - stock_quantity: optional non-negative integer (full number >= 0, defaults to 0)
 */
const validateCreateProduct = (req, res, next) => {
  const { category_id, name, price, stock_quantity } = req.body

  if (!isNonEmptyString(name)) {
    return res.status(400).json({
      message: 'Product name is required and must be a valid text string'
    })
  }

  if (category_id === undefined || category_id === null || !isPositiveInteger(category_id)) {
    return res.status(400).json({
      message: 'category_id is required and must be a positive full number (integer)'
    })
  }

  if (price === undefined || price === null || !isNonNegativeFloat(price, { maxDecimalPlaces: 2 })) {
    return res.status(400).json({
      message:
        'price is required and must be a valid non-negative number (float/decimal with up to 2 decimal places)'
    })
  }

  if (stock_quantity !== undefined && stock_quantity !== null && !isNonNegativeInteger(stock_quantity)) {
    return res.status(400).json({
      message:
        'stock_quantity must be a non-negative full number (integer >= 0)'
    })
  }

  // Sanitize / type-cast validated values
  req.body.name = name.trim()
  req.body.category_id = parseInt(category_id, 10)
  req.body.price = parseFloat(Number(price).toFixed(2))
  req.body.stock_quantity =
    stock_quantity !== undefined && stock_quantity !== null
      ? parseInt(stock_quantity, 10)
      : 0

  next()
}

/**
 * Middleware to validate product update payload.
 * Validates fields if present:
 * - name: non-empty string
 * - category_id: positive integer (full number > 0)
 * - price: non-negative float (decimal number >= 0, max 2 decimals)
 * - stock_quantity: non-negative integer (full number >= 0)
 */
const validateUpdateProduct = (req, res, next) => {
  const { category_id, name, price, stock_quantity } = req.body

  const hasName = name !== undefined
  const hasCategoryId = category_id !== undefined
  const hasPrice = price !== undefined
  const hasStockQuantity = stock_quantity !== undefined

  if (!hasName && !hasCategoryId && !hasPrice && !hasStockQuantity) {
    return res.status(400).json({
      message:
        'At least one field (name, category_id, price, stock_quantity) must be provided for update'
    })
  }

  if (hasName) {
    if (!isNonEmptyString(name)) {
      return res.status(400).json({
        message: 'Product name must be a valid non-empty text string'
      })
    }
    req.body.name = name.trim()
  }

  if (hasCategoryId) {
    if (category_id === null || !isPositiveInteger(category_id)) {
      return res.status(400).json({
        message: 'category_id must be a positive full number (integer)'
      })
    }
    req.body.category_id = parseInt(category_id, 10)
  }

  if (hasPrice) {
    if (price === null || !isNonNegativeFloat(price, { maxDecimalPlaces: 2 })) {
      return res.status(400).json({
        message:
          'price must be a valid non-negative number (float/decimal with up to 2 decimal places)'
      })
    }
    req.body.price = parseFloat(Number(price).toFixed(2))
  }

  if (hasStockQuantity) {
    if (stock_quantity === null || !isNonNegativeInteger(stock_quantity)) {
      return res.status(400).json({
        message:
          'stock_quantity must be a non-negative full number (integer >= 0)'
      })
    }
    req.body.stock_quantity = parseInt(stock_quantity, 10)
  }

  next()
}

/**
 * Middleware to validate category creation payload.
 */
const validateCreateCategory = (req, res, next) => {
  const { name } = req.body

  if (!isNonEmptyString(name)) {
    return res.status(400).json({
      message: 'Category name is required and must be a valid text string'
    })
  }

  req.body.name = name.trim()
  next()
}

/**
 * Middleware to validate category update payload.
 */
const validateUpdateCategory = (req, res, next) => {
  const { name } = req.body

  if (!isNonEmptyString(name)) {
    return res.status(400).json({
      message: 'Category name is required and must be a valid text string'
    })
  }

  req.body.name = name.trim()
  next()
}

/**
 * Middleware to validate login payload.
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body

  if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
    return res.status(400).json({
      message: 'Email and password are required and must be valid strings'
    })
  }

  req.body.email = email.trim()
  next()
}

module.exports = {
  validateIdParam,
  validateProductQuery,
  validateCreateProduct,
  validateUpdateProduct,
  validateCreateCategory,
  validateUpdateCategory,
  validateLogin
}
