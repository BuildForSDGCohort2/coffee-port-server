const userResolvers = require('./user.js');
const productResolvers = require('./product.js');
const reviewResolvers = require('./review.js');

module.exports = [userResolvers, productResolvers, reviewResolvers];
