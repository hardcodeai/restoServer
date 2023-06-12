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
            // {$lookup:{
            //     let: {menu_item_ids: '$items.item'},
            //     from: 'menuitems',
            //     pipeline: [
            //         {$match: {$expr: {$in: ['$_id', '$$menu_item_ids']}}},
            //         {$project: {name: 1, price: 1}}
            //     ],
            //     as: 'items'
            // }}
        ])
        .exec();

        console.log(userCart[0],"this is the user cart 0")

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

  addToCart: async ({ userId, menuItemId}) => {
    // Implement logic to add an item to the cart
    //if the cart exists, add the menu item to the cart
    // if the cart does not exist, create a new cart and add the menu item to the cart
    try {
        const cart = await Cart.findOne({userId});
        if (cart) {
            // Add menu item to existing cart
            cart.items.push([{item: menuItemId,quantity:1}]);
            await cart.save();
            return cart;
        } else {
            // Create new cart
            const newCart = new Cart({
                id: '123',
                items: [{item: menuItemId,quantity:1}],
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
  updateItemQuantity: async ({ cartId, menuItemId, quantity }) => {
    // Implement logic to update the quantity of an item in the cart
    // if the quantity is 0, remove the menu item from the cart
    // if the quantity is greater than 0, update the quantity of the menu item in the cart
    try {
        const cart = await Cart.findOne({_id: cartId}).exec();
        let cartData = JSON.parse(JSON.stringify(cart));
        if (cartData) {

            console.log(cartData,"this is the cart before")

            // Update menu item quantity in existing cart

            console.log(cartData.items.map(p=>p.item),menuItemId,cartData.items.map(p=>p.item).indexOf(menuItemId),"freaky")

            const index = cartData.items.map(p=>p.item).indexOf(menuItemId);
            console.log(index,"this is the index")
            if (index > -1) {
                if (quantity === 0) {
                    cart.items.splice(index, 1);
                } else {
                    console.log('here')
                    cart.items[index] = {menuItemId, quantity};
                }
            }

            console.log(cart,"this is the cart after")

            await cart.save();
            return cart;
        } else {
            throw new Error('Cart does not exist');
        } 
    } catch (error) {
        console.error('Error updating item quantity:', error);
        throw new Error('Failed to update item quantity');
    }
  }
};

module.exports = cartResolvers;
