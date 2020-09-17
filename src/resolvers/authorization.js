const { ForbiddenError } = require('apollo-server');
const { skip, combineResolvers } = require('graphql-resolvers');
const models = require('../models');

// check if ther current user is authenticated or not
const isAuthenitcated = (parent, args, { currentUser }) => {
  return currentUser
    ? skip
    : new ForbiddenError('Not autheticated as  user');
};

const isProductOwner = async (
  parent,
  { id },
  { models: { Product }, currentUser },
) => {
  const product = await Product.findById(id);
  // console.log(`product: ${product}`);
  if (product.user.id !== currentUser.id) {
    throw new ForbiddenError('Not authenticated as owner');
  }
  return skip;
};

const isAdmin = combineResolvers(
  isAuthenitcated,
  (parent, args, { currentUser: { role } }) => {
    return role === 'ADMIN'
      ? skip
      : new ForbiddenError('Not authorized as admin.');
  },
);
module.exports = { isAuthenitcated, isProductOwner, isAdmin };
