const db = require('../config/db')

exports.getProducts = async (req, res) => {
  const page = req.query.page || 1
  const limit = req.query.limit || 10
  const search = req.query.search ? String(req.query.search).trim() : ''
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

    const total = totalResult ? totalResult.total : 0

    res.json({
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ message: 'Server error fetching products' })
  }
}

exports.createProduct = async (req, res) => {
  const { category_id, name, price, stock_quantity } = req.body

  try {
    // Check if category exists
    const category = await db('categories').where({ id: category_id }).first()
    if (!category) {
      return res.status(400).json({ message: 'Category not found with the provided category_id' })
    }

    const [id] = await db('products').insert({
      category_id,
      name,
      price,
      stock_quantity: stock_quantity !== undefined ? stock_quantity : 0
    })

    const newProduct = await db('products')
      .join('categories', 'products.category_id', '=', 'categories.id')
      .select('products.*', 'categories.name as category_name')
      .where('products.id', id)
      .first()

    res.status(201).json({
      id,
      message: 'Product created successfully',
      data: newProduct
    })
  } catch (error) {
    console.error('Error creating product:', error)
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ message: 'Category not found with the provided category_id' })
    }
    res.status(500).json({ message: 'Server error creating product' })
  }
}

exports.updateProduct = async (req, res) => {
  const { id } = req.params
  const { category_id, name, price, stock_quantity } = req.body

  const updateData = {}
  if (category_id !== undefined) updateData.category_id = category_id
  if (name !== undefined) updateData.name = name
  if (price !== undefined) updateData.price = price
  if (stock_quantity !== undefined) updateData.stock_quantity = stock_quantity

  try {
    if (category_id !== undefined) {
      const category = await db('categories').where({ id: category_id }).first()
      if (!category) {
        return res.status(400).json({ message: 'Category not found with the provided category_id' })
      }
    }

    const updated = await db('products')
      .where({ id })
      .update(updateData)

    if (!updated) {
      return res.status(404).json({ message: 'Product not found' })
    }

    const updatedProduct = await db('products')
      .join('categories', 'products.category_id', '=', 'categories.id')
      .select('products.*', 'categories.name as category_name')
      .where('products.id', id)
      .first()

    res.json({ message: 'Product updated successfully', data: updatedProduct })
  } catch (error) {
    console.error('Error updating product:', error)
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ message: 'Category not found with the provided category_id' })
    }
    res.status(500).json({ message: 'Server error updating product' })
  }
}

exports.deleteProduct = async (req, res) => {
  const { id } = req.params

  try {
    const deleted = await db('products').where({ id }).del()
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({ message: 'Server error deleting product' })
  }
}
