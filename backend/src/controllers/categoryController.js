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

exports.updateCategory = async (req, res) => {
  const { id } = req.params
  const { name } = req.body

  if (!name)
    return res.status(400).json({ message: 'Category name is required' })

  try {
    const updated = await db('categories').where({ id }).update({ name })
    if (!updated) return res.status(404).json({ message: 'Category not found' })

    res.json({ message: 'Category updated successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error updating category' })
  }
}

exports.deleteCategory = async (req, res) => {
  const { id } = req.params

  try {
    const deletedCount = await db('categories').where({ id }).del()

    if (!deletedCount) {
      return res.status(404).json({ message: 'Category not found' })
    }

    res.json({ message: 'Category deleted successfully' })
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({
        message:
          'Cannot delete this category because it still contains products.'
      })
    }
    console.error(error)
    res.status(500).json({ message: 'Server error deleting category' })
  }
}
