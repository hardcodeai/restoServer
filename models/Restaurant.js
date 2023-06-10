const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: String,
  // Add more fields as per your requirements
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
