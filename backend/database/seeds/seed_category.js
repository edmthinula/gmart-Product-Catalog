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
    { id: 3, name: 'Dairy & Eggs' },
    { id: 4, name: 'Beverages' },
    { id: 5, name: 'Bakery & Snacks' },
    { id: 6, name: 'Meat & Seafood' },
    { id: 7, name: 'Frozen Foods' },
    { id: 8, name: 'Personal Care & Household' }
  ])
}
