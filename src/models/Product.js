const { model, Schema } = require('mongoose');

const productSchema = new Schema({
  productName: String,
  productPrice: Number,
  productQuantity: Number,
  productMeasurementUnit: String,
  uniqueAttributes: {
    geographicalDesignation: { type: String },
    grade: { type: String },
    group: { type: String },
    uniqueName: { type: String },
  },
  user: {
    createdAt: String,
    email: String,
    password: String,
    role: String,
    firstName: String,
    lastName: String,
    phoneNumber: String,
    company: {
      websiteUrl: { type: String },
      companyName: { type: String },
      companyEmail: { type: String },
      address: {
        country: { type: String },
        city: { type: String },
        street: { type: String },
        postalCode: { type: String },
      },
    },
  },
  review: {
    text: { type: String },
  },
  code: String,
  success: Boolean,
  message: String,
});

module.exports = model('Product', productSchema);
