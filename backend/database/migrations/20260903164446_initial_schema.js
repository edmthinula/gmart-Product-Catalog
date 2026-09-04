/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return (
    knex.schema
      // 1. Create Admins (Users) Table
      .createTable('users', table => {
        table.increments('id').primary()
        table.string('name').notNullable()
        table.string('email').notNullable().unique()
        table.string('password').notNullable() // Will store bcrypt hash
        table.timestamps(true, true) // Adds created_at and updated_at
      })

      // 2. Create Categories Table
      .createTable('categories', table => {
        table.increments('id').primary()
        table.string('name').notNullable()
        table.timestamps(true, true)
      })

      // 3. Create Products Table
      .createTable('products', table => {
        table.increments('id').primary()

        // Foreign Key linking to Categories
        table.integer('category_id').unsigned().notNullable()
        table
          .foreign('category_id')
          .references('id')
          .inTable('categories')
          .onDelete('RESTRICT')
        // 'RESTRICT' automatically blocks deleting a category if it has products inside it.

        table.string('name').notNullable()
        table.decimal('price', 10, 2).notNullable()

        // .unsigned() prevents negative numbers at the database level (stock >= 0)
        table.integer('stock_quantity').unsigned().notNullable().defaultTo(0)

        table.timestamps(true, true)
      })
  )
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
    .dropTableIfExists('products')
    .dropTableIfExists('categories')
    .dropTableIfExists('users');
}
