const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
  price: { type: Number, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
});


const cartSchema = new mongoose.Schema({
  items: {
      type: [cartItemSchema],

  }
  ,
  userId: {
    type: mongoose.Schema.Types.String,
  }
});

module.exports = mongoose.model('Cart', cartSchema);
