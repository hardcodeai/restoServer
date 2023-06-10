const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');


//test queries
// # query SearchRestaurants($query: String!) {
//     #   searchRestaurants(query: $query) {
//     #     _id
//     #     name
//     #   }
//     # }

// {
//     "query": "Restaurant 1"
//   }


// query SearchMenu($restaurantId: ID!) {
//     getMenuItems(restaurantId: $restaurantId) {
//       _id
//       name
//     }
//   }

// {
//     "restaurantId": "64847da80d48661bdc4b8cbc"
//   }


const restaurantResolvers = {
  searchRestaurants: async ({ query }) => {
    const restaurantsByName = await Restaurant.aggregate([
        {
            $match:{name: {$regex: query, $options: 'i'}},
        }
    ]).exec();

    const restaurantsByDishes = await MenuItem.aggregate([
        {
            $match:{name: {$regex: query, $options: 'i'}},
        },
        {$lookup:{
            from: 'restaurants',
            localField: 'restaurant',
            foreignField: '_id',
            as: 'restaurant'
        }},
        {$unwind: '$restaurant'}
    ]).exec();

    const restaurants = [...restaurantsByName, ...(restaurantsByDishes || []).map(p=>p.restaurant)]
    console.log(restaurants)
    return restaurants
    // Implement logic to search restaurants by name and dishes
  },

  getMenuItems: async ({ restaurantId }) => {
    // Implement logic to fetch menu items by restaurant ID
    const menuItems = await MenuItem.find({restaurant: restaurantId}).exec();
    return menuItems;
  },
};

module.exports = restaurantResolvers;
