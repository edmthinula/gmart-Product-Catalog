/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('products').del()

  await knex('products').insert([
    {
      category_id: 1,
      name: 'Cavendish Bananas',
      price: 1.99,
      stock_quantity: 80
    },
    {
      category_id: 1,
      name: 'Roma Tomatoes',
      price: 3.49,
      stock_quantity: 45
    },
    {
      category_id: 2,
      name: 'Basmati Rice 5kg',
      price: 12.99,
      stock_quantity: 30
    },
    {
      category_id: 2,
      name: 'All-Purpose Flour 1kg',
      price: 2.79,
      stock_quantity: 55
    },
    {
      category_id: 3,
      name: 'Large Brown Eggs 12 Pack',
      price: 4.99,
      stock_quantity: 36
    },
    {
      category_id: 3,
      name: 'Whole Milk 1L',
      price: 2.49,
      stock_quantity: 28
    },
    {
      category_id: 4,
      name: 'Sparkling Water 6 Pack',
      price: 5.99,
      stock_quantity: 40
    }
  ])
}
