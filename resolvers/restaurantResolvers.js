const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const mongoose = require('mongoose')


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
    return restaurants
    // Implement logic to search restaurants by name and dishes
  },
  getRestaurantDetails: async ({ restaurantId }) => {
    const restaurant = await Restaurant.findById(restaurantId).exec();
    const menuItems = await MenuItem.find({restaurant: restaurantId}).exec();
    const restaurantDetails = {...(restaurant.toObject() || {}), dishes: menuItems || []};
    console.log(restaurantDetails, 'this is the restaurant details')
    return restaurantDetails
  },
};

module.exports = restaurantResolvers;
