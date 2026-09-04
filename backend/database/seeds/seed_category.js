/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('products').del()
  await knex('categories').del()

  await knex('categories').insert([
    { id: 1, name: 'Fresh Produce' },
    { id: 2, name: 'Pantry Staples' },
    { id: 3, name: 'Dairy and Eggs' },
    { id: 4, name: 'Beverages' }
  ])
}
