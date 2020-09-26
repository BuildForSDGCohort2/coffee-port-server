const { model, Schema } = require('mongoose');

const reviewSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  text: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  code: String,
  success: Boolean,
  message: String,
});

module.exports = model('Review', reviewSchema);
