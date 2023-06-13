const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: String,
  image: String,
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
