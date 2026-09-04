const db = require('../config/db')

exports.getCategories = async (req, res) => {
  try {
    const categories = await db('categories').select('*')
    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching categories' })
  }
}

exports.createCategory = async (req, res) => {
  const { name } = req.body

  if (!name)
    return res.status(400).json({ message: 'Category name is required' })

  try {
    const [id] = await db('categories').insert({ name })
    const newCategory = await db('categories').where({ id }).first()
    res.status(201).json(newCategory)
  } catch (error) {
    res.status(500).json({ message: 'Server error creating category' })
  }
}
