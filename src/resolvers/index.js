const userResolvers = require('./user.js');
const productResolvers = require('./product.js');
const reviewResolvers = require('./review.js');
const reportResolvers = require('./report.js');

module.exports = [userResolvers, productResolvers, reviewResolvers, reportResolvers];
