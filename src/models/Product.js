const { model, Schema } = require('mongoose');

const productSchema = new Schema({
  productName: String,
  productPrice: Number,
  productQuantity: Number,
  productMeasurementUnit: String,
  productDescription: String,
  purchased: {
    type: Boolean,
    default: false,
  },
  uniqueAttributes: {
    geographicalDesignation: { type: String },
    grade: { type: String },
    group: { type: String },
    uniqueName: { type: String },
    flowerType: { type: String },
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reviews: [
    {
      comment: { type: String },
      stars: { type: Number },
      reviewerEmail: { type: String },
      createdAt: { type: String },
    },
  ],
});

module.exports = model('Product', productSchema);
