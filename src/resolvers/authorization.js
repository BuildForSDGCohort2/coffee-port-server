/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable indent */
/* eslint-disable no-confusing-arrow */
const { ForbiddenError } = require('apollo-server');
const { skip, combineResolvers } = require('graphql-resolvers');

// check if ther current user is authenticated or not
const isAuthenitcated = (_, __, { currentUser }) =>
  currentUser
    ? skip
    : {
        __typename: 'NotAuthenticatedUserError',
        message: 'not authenticated as a user',
      };

const isProductOwner = async (
  _,
  { id },
  { models: { Product }, currentUser },
) => {
  const product = await Product.findById(id);
  if (!product) {
    return {
      __typename: 'ProductOwnerError',
      message: "Product doesn't exist",
    };
  }
  if (product.user.email !== currentUser.email) {
    return {
      __typename: 'ProductOwnerError',
      message: 'Not authenticated as product owner',
    };
  }
  return skip;
};

const isReviewOwner = async (
  _,
  { productId, reviewId },
  { models: { Product }, currentUser: { email } },
) => {
  const product = await Product.findById(productId);
  if (!product) {
    return {
      __typename: 'ReviewOwnerError',
      message: "Product doesn't exist",
    };
  }

  const reviewIndex = product.reviews.findIndex(
    (review) => reviewId === review.id,
  );

  if (product.reviews[reviewIndex].reviewerEmail !== email) {
    return {
      __typename: 'ReviewOwnerError',
      message: 'Not authenticated as review owner',
    };
  }

  return skip;
};
const isAdmin = combineResolvers(
  isAuthenitcated,
  (_, __, { currentUser: { role } }) =>
    role === 'ADMIN'
      ? skip
      : new ForbiddenError('Not authorized as admin.'),
);
module.exports = { isAuthenitcated, isProductOwner, isAdmin };
