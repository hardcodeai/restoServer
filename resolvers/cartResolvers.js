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
    try {
        const userCart = await Cart.aggregate([
            {$match:{$or:[{_id: new mongoose.Types.ObjectId(cartId)},{userId}]}}, 
            {$limit: 1},
        ])
        .exec();

        if(!userCart.length && userId){
            userCart.push(new Cart({items:[], userId, cartId}).save());
        }
        return userCart[0] || {};
    } catch (error) {
        throw new Error('Failed to retrieve cart');
    }
  },

  calculateTotalBill: async ({cartId,discountrate,taxRate}) => {
    // Implement logic to calculate the total bill
    const {items} = await Cart.findById(cartId).exec();
    const discount = discountRate || 0;
    const tax = taxRate || 0;
    // Calculate the total price
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);
    // Apply discount and tax to the total price
    const discountedPrice = totalPrice - (totalPrice * discount) / 100;
    const totalPriceWithTax = discountedPrice + (discountedPrice * tax) / 100;

    return totalPriceWithTax;
  },

  addToCart: async ({cartId, userId, menuItemId}) => {
    // Implement logic to add an item to the cart
    //if the cart exists, add the menu item to the cart
    // if the cart does not exist, create a new cart and add the menu item to the cart

    try {
        const cart = await Cart.findOne({$or:[{userId}, {_id: cartId}]});
        const {_id,name,price} = await MenuItem.findOne({_id: menuItemId}).exec();
        if (cart) {
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
        throw new Error('Failed to add item to cart');
    }
  },
  updateItemQuantity: async ({ cartId, menuItemId, quantity }) => {
    try {
        const cart = await Cart.findOne({_id: cartId}).exec();
        let cartData = JSON.parse(JSON.stringify(cart));
        if (cartData) {
            const index = cartData.items.map(p=>p._id).indexOf(menuItemId);
            if (index > -1) {
                if (quantity === 0) {
                    cart.items.splice(index, 1);
                } else {
                    const {price,name,_id} = cart.items[index];
                    cart.items[index] = {price, name , _id, quantity};
                }
            }

            await cart.save();
            
            return cart;
        } else {
            throw new Error('Cart does not exist');
        } 
    } catch (error) {
        throw new Error('Failed to update item quantity');
    }
  }
};

module.exports = cartResolvers;
