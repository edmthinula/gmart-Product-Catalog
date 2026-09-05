/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('products').del()

  await knex('products').insert([
    // Category 1: Fresh Produce
    {
      category_id: 1,
      name: 'Cavendish Bananas 1kg',
      price: 1.99,
      stock_quantity: 80
    },
    {
      category_id: 1,
      name: 'Roma Tomatoes 1kg',
      price: 3.49,
      stock_quantity: 45
    },
    {
      category_id: 1,
      name: 'Organic Gala Apples 1kg',
      price: 4.29,
      stock_quantity: 50
    },
    {
      category_id: 1,
      name: 'Fresh Hass Avocados 3 Pack',
      price: 3.99,
      stock_quantity: 35
    },
    {
      category_id: 1,
      name: 'Baby Spinach Leaves 250g',
      price: 2.49,
      stock_quantity: 40
    },

    // Category 2: Pantry Staples
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
      category_id: 2,
      name: 'Extra Virgin Olive Oil 750ml',
      price: 9.49,
      stock_quantity: 25
    },
    {
      category_id: 2,
      name: 'Organic Penne Pasta 500g',
      price: 1.89,
      stock_quantity: 60
    },
    {
      category_id: 2,
      name: 'Pure Wildflower Honey 500g',
      price: 6.99,
      stock_quantity: 20
    },

    // Category 3: Dairy & Eggs
    {
      category_id: 3,
      name: 'Large Brown Eggs 12 Pack',
      price: 4.99,
      stock_quantity: 36
    },
    {
      category_id: 3,
      name: 'Whole Fresh Milk 1L',
      price: 2.49,
      stock_quantity: 28
    },
    {
      category_id: 3,
      name: 'Pure Salted Butter 250g',
      price: 3.89,
      stock_quantity: 32
    },
    {
      category_id: 3,
      name: 'Greek Style Yogurt 500g',
      price: 4.29,
      stock_quantity: 22
    },
    {
      category_id: 3,
      name: 'Aged Cheddar Cheese 400g',
      price: 5.79,
      stock_quantity: 18
    },

    // Category 4: Beverages
    {
      category_id: 4,
      name: 'Sparkling Mineral Water 6 Pack',
      price: 5.99,
      stock_quantity: 40
    },
    {
      category_id: 4,
      name: 'Freshly Squeezed Orange Juice 1L',
      price: 3.99,
      stock_quantity: 25
    },
    {
      category_id: 4,
      name: 'Premium Medium Roast Coffee Beans 500g',
      price: 11.49,
      stock_quantity: 15
    },
    {
      category_id: 4,
      name: 'English Breakfast Tea 50 Bags',
      price: 4.59,
      stock_quantity: 30
    },
    {
      category_id: 4,
      name: 'Cold Brew Iced Coffee 330ml',
      price: 2.99,
      stock_quantity: 35
    },

    // Category 5: Bakery & Snacks
    {
      category_id: 5,
      name: 'Whole Grain Sandwich Bread 700g',
      price: 2.89,
      stock_quantity: 24
    },
    {
      category_id: 5,
      name: 'Artisan Sourdough Loaf 500g',
      price: 4.49,
      stock_quantity: 16
    },
    {
      category_id: 5,
      name: 'Roasted & Salted Almonds 200g',
      price: 4.99,
      stock_quantity: 40
    },
    {
      category_id: 5,
      name: 'Dark Chocolate Chip Cookies 200g',
      price: 3.29,
      stock_quantity: 30
    },

    // Category 6: Meat & Seafood
    {
      category_id: 6,
      name: 'Skinless Chicken Breast Fillets 1kg',
      price: 9.99,
      stock_quantity: 20
    },
    {
      category_id: 6,
      name: 'Fresh Atlantic Salmon Fillets 400g',
      price: 13.49,
      stock_quantity: 14
    },
    {
      category_id: 6,
      name: 'Lean Grass-Fed Ground Beef 500g',
      price: 7.99,
      stock_quantity: 18
    },

    // Category 7: Frozen Foods
    {
      category_id: 7,
      name: 'Stone-Baked Margherita Pizza 400g',
      price: 6.49,
      stock_quantity: 25
    },
    {
      category_id: 7,
      name: 'Madagascar Vanilla Bean Ice Cream 1L',
      price: 5.49,
      stock_quantity: 20
    },
    {
      category_id: 7,
      name: 'Frozen Mixed Forest Berries 500g',
      price: 4.89,
      stock_quantity: 22
    },

    // Category 8: Personal Care & Household
    {
      category_id: 8,
      name: 'Eco-Friendly Liquid Dish Soap 500ml',
      price: 2.99,
      stock_quantity: 35
    },
    {
      category_id: 8,
      name: 'Bamboo Paper Towels 4 Pack',
      price: 6.29,
      stock_quantity: 28
    }
  ])
}
