const userResolvers = require('./user.js');
const productResolvers = require('./product.js');
const reviewResolvers = require('./review.js');
const reportResolvers = require('./report.js');
const requestResolvers = require('./request.js');

module.exports = [
  userResolvers,
  productResolvers,
  reviewResolvers,
  requestResolvers,
  reportResolvers,
];
