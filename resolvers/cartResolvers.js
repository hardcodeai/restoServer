const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');
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
  getCart: async ({cartId, userId}) => {
    console.log(cartId,userId,"this is the thingy")
    try {
        const userCart = await Cart.aggregate([
            {$match:{$or:[{_id: new mongoose.Types.ObjectId(cartId)},{userId}]}}, 
            {$limit: 1},
        ])
        .exec();
        console.log(userCart,"this is the user cart")

        if(!userCart.length && userId){
            userCart.push(new Cart({items:[], userId, cartId}).save());
        }

        console.log(userCart[0],"this is the user cart after")

        return userCart[0] || {};
    } catch (error) {
        console.error('Error retrieving cart:', error);
        throw new Error('Failed to retrieve cart');
    }
  },

  calculateTotalBill: async ({userId}) => {
    // Implement logic to calculate the total bill
    return 4.52;
  },

  addToCart: async ({cartId, userId, menuItemId}) => {
    // Implement logic to add an item to the cart
    //if the cart exists, add the menu item to the cart
    // if the cart does not exist, create a new cart and add the menu item to the cart

    console.log(cartId,userId,menuItemId,"this is the thingy")
    
    try {
        const cart = await Cart.findOne({$or:[{userId}, {_id: cartId}]});
        const {_id,name,price} = await MenuItem.findOne({_id: menuItemId}).exec();
        if (cart) {
            console.log('1') 
            // Add menu item to existing cart
            if(cart.items.find(p=>p._id == menuItemId)){
                cart.items.find(p=>p._id == menuItemId).quantity++;
            }else{
                cart.items.push({_id, price, name , quantity:1});
            }
            await cart.save();
            return cart;
        } else {
            const newCart = new Cart({
                id: '123',
                items: [{_id, price, name ,quantity:1}],
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
    console.log(cartId, menuItemId, quantity,'control comes in here')
    try {
        const cart = await Cart.findOne({_id: cartId}).exec();
        let cartData = JSON.parse(JSON.stringify(cart));
        if (cartData) {
            console.log(cartData,"this is the cart data----->")
            const index = cartData.items.map(p=>p._id).indexOf(menuItemId);
            console.log(index,"this is the index----->")
            if (index > -1) {
                if (quantity === 0) {
                    console.log(quantity,"quantity ---->")
                    cart.items.splice(index, 1);
                } else {
                    console.log(quantity,"quantity ---->2")
                    const {price,name,_id} = cart.items[index];
                    cart.items[index] = {price, name , _id, quantity};
                    console.log("hogya")
                }
            }

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
