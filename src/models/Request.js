const { Schema, model } = require('mongoose');

const requestSchema = new Schema({
  requestedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  requestedProduct: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  requestStatus: String,
  createdAt: String,
  acceptedByOrDeclinedBy: String,
});

module.exports = model('Request', requestSchema);
