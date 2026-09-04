const bcrypt = require('bcryptjs')
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries to prevent duplicates if run multiple times
  await knex('users').del()

  // Hash the password 'admin123'
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash('admin123', salt)

  // Insert the default admin
  await knex('users').insert([
    {
      name: 'Admin',
      email: 'admin@gmart.com',
      password: hashedPassword
    }
  ])
}
