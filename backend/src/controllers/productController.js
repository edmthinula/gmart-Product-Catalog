const db = require('../config/db')

exports.getProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const search = req.query.search || ''
  const offset = (page - 1) * limit

  try {
    // Base query: join products with categories to get the category name
    let query = db('products')
      .join('categories', 'products.category_id', '=', 'categories.id')
      .select('products.*', 'categories.name as category_name')

    // Apply search filter if provided
    if (search) {
      query = query.where('products.name', 'like', `%${search}%`)
    }

    // Clone the query to get the total count for frontend pagination logic
    const countQuery = query.clone().clearSelect().count('* as total').first()

    // Apply pagination to the main query
    const productsQuery = query
      .limit(limit)
      .offset(offset)
      .orderBy('products.id', 'desc')

    const [totalResult, products] = await Promise.all([
      countQuery,
      productsQuery
    ])

    res.json({
      data: products,
      total: totalResult.total,
      page,
      limit,
      totalPages: Math.ceil(totalResult.total / limit)
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error fetching products' })
  }
}

exports.createProduct = async (req, res) => {
  const { category_id, name, price, stock_quantity } = req.body

  // Validate stock never drops below 0
  if (stock_quantity < 0) {
    return res
      .status(400)
      .json({ message: 'Stock quantity cannot be less than 0' })
  }

  try {
    const [id] = await db('products').insert({
      category_id,
      name,
      price,
      stock_quantity
    })
    res.status(201).json({ id, message: 'Product created successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error creating product' })
  }
}

exports.updateProduct = async (req, res) => {
  const { id } = req.params
  const { category_id, name, price, stock_quantity } = req.body

  if (stock_quantity !== undefined && stock_quantity < 0) {
    return res
      .status(400)
      .json({ message: 'Stock quantity cannot be less than 0' })
  }

  try {
    const updated = await db('products')
      .where({ id })
      .update({ category_id, name, price, stock_quantity })

    if (!updated) return res.status(404).json({ message: 'Product not found' })
    res.json({ message: 'Product updated successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error updating product' })
  }
}

exports.deleteProduct = async (req, res) => {
  const { id } = req.params
  try {
    const deleted = await db('products').where({ id }).del()
    if (!deleted) return res.status(404).json({ message: 'Product not found' })
    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting product' })
  }
}
