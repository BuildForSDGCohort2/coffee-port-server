const { model, Schema } = require('mongoose');

const productSchema = new Schema({
  productName: String,
  uniqueAttributes: {
    geographicalDesignation: { type: String },
    grade: { type: String },
    group: { type: String },
    uniqueName: { type: String },
  },
  user: {
    email: String,
    role: String,

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
});

module.exports = model('Product', productSchema);
