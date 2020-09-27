const { Schema, model } = require('mongoose');

const requestSchema = new Schema({
  requestedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  requestStatus: String,
  createdAt: String,
});

module.exports = model('Request', requestSchema);
