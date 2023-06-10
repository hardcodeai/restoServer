const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');

async function populateData() {
  try {
    // Clear existing data
    await Restaurant.deleteMany();
    // await MenuItem.deleteMany();

    // Generate restaurants
    const restaurants = [];
    for (let i = 0; i < 5; i++) {
      const restaurant = new Restaurant({
        name: 'Restaurant ' + i,
      });
      restaurants.push(restaurant);
    }
    await Restaurant.insertMany(restaurants);

    // Generate menu items for each restaurant
    for (const restaurant of restaurants) {
      const menuItems = [];
      for (let i = 0; i < 10; i++) {
        const menuItem = new MenuItem({
          name: 'Menu Item ' + i,
          price: Math.floor(Math.random() * 100),
          restaurant: restaurant._id,
        });
        menuItems.push(menuItem);
      }
      await MenuItem.insertMany(menuItems);
    }

    console.log('Data populated successfully');
  } catch (error) {
    console.error('Error populating data:', error);
  }
}

module.exports.populateData = populateData;
