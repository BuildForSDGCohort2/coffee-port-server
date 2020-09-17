const { ForbiddenError } = require('apollo-server');
const { skip, combineResolvers } = require('graphql-resolvers');
const models = require('../models');

// check if ther current user is authenticated or not
const isAuthenitcated = (parent, args, { currentUser }) => {
  return currentUser
    ? skip
    : {
        __typename: 'NotAuthenticatedUserError',
        message: 'not authenticated as a user',
      };
};

const isProductOwner = async (
  parent,
  { id },
  { models: { Product }, currentUser },
) => {
  const product = await Product.findById(id);
  if (!product) {
    return {
      __typename: 'DeleteProductPostError',
      message: "Product doesn't exist",
    };
  }
  if (product.user.email !== currentUser.email) {
    return {
      __typename: 'DeleteProductPostError',
      message: 'Not authenticated as product owner',
    };
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
