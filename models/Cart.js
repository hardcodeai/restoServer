const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
    }
  ],
  userId: {
    type: mongoose.Schema.Types.String,
  }
});

module.exports = mongoose.model('Cart', cartSchema);
