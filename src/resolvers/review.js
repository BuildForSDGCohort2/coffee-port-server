/* eslint-disable no-underscore-dangle */
const { combineResolvers } = require('graphql-resolvers');

const {
  isAuthenitcated,
} = require('./authorization.js');

module.exports = {
  Mutation: {
    postReview: combineResolvers(
      isAuthenitcated,
      async (
        _,
        {
          productId,
          text,
        },
        { models: { Review, Product }, currentUser },
      ) => {
        try {
          const foundProduct = await Product.findById(productId);
          if (!foundProduct) {
            return {
              __typename: 'GetProductError',
              message: 'Unable to get product',
              // type: `${err}`,
            };
          }
          const newReview = new Review({
            product: foundProduct,
            text,
            user: currentUser,
          });

          const res = await newReview.save();
          return {
            __typename: 'Review',
            ...res._doc,
            id: res._id,
          };
        } catch (err) {
          return {
            __typename: 'ReviewNotAddedError',
            message: 'Unable to add your review.',
            type: `${err}`,
          };
        }
      },
    ),

  },

  Query: {
    async reviews(_, { productId }, { models: { Review } }) {
      try {
        const entireReviews = await Review.find({ product: productId });
        return {
          __typename: 'Review',
          ...entireReviews._doc,
          id: entireReviews._doc._id,
        };
      } catch (err) {
        return {
          __typename: 'GetReviewsError',
          message: 'Unable to get reviews',
          type: `${err}`,
        };
      }
    },
    async review(_, { productId, reviewId }, { models: { Review } }) {
      try {
        const requiredReview = await Review.find({ product: productId, id: reviewId });
        return requiredReview;
      } catch (err) {
        return {
          __typename: 'GetReviewsError',
          message: 'Unable to get reviews',
          type: `${err}`,
        };
      }
    },
  },
};
