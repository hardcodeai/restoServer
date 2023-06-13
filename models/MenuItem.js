const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
  },
  // Add more fields as per your requirements
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
