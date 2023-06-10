const Cart = require('../models/Cart');
const mongoose = require('mongoose')


//testing data
// query GetCart($cartId: ID!) {
//     getCart(cartId: $cartId) {
//       id
//       items {
//         id
//         name
//         price
//       }
//     }
//   }

// {
//     "cartId":"123"
//   }

    
// mutation AddToCart($userId: ID!, $menuItemId: ID!) {
//   addToCart(userId: $userId, menuItemId: $menuItemId) {
//     id
//   }
// }

// {
//     "userId": "123",
//     "menuItemId": "5f8b8b4b7d1b7b1b1c3b0b1b"
// }




const cartResolvers = {
  getCart: async ({cartId}) => {
    try {
        const userCart = await Cart.aggregate([
            {$match:{_id: new mongoose.Types.ObjectId(cartId)}}, 
            {$limit: 1},
            {$lookup:{
                let: {menu_item_ids: '$items'},
                from: 'menuitems',
                pipeline: [
                    {$match: {$expr: {$in: ['$_id', '$$menu_item_ids']}}},
                    {$project: {name: 1, price: 1}}
                ],
                as: 'items'
            }}
        ])
        .exec();
        return userCart[0] || {}
    } catch (error) {
        console.error('Error retrieving cart:', error);
        throw new Error('Failed to retrieve cart');
    }
  },

  calculateTotalBill: async ({userId}) => {
    // Implement logic to calculate the total bill
    return 4.52;
  },

  addToCart: async ({ userId, menuItemId }) => {
    // Implement logic to add an item to the cart
    //if the cart exists, add the menu item to the cart
    // if the cart does not exist, create a new cart and add the menu item to the cart
    try {
        const cart = await Cart.findOne({id: '123'});
        if (cart) {
            // Add menu item to existing cart
            cart.items.push(menuItemId);
            await cart.save();
            return cart;
        } else {
            // Create new cart
            const newCart = new Cart({
                id: '123',
                items: [menuItemId],
                userId,
            });
            await newCart.save();
            return newCart;
        } 
    } catch (error) {
        console.error('Error adding item to cart:', error);
        throw new Error('Failed to add item to cart');
    }
  },
};

module.exports = cartResolvers;
