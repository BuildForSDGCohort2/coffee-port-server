const { model, Schema } = require('mongoose');
const productSchema = new Schema({
  type: String,
  name: String,
  userId: String,
});

module.exports = model('Product', productSchema);
