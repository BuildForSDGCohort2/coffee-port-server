/* eslint-disable no-underscore-dangle */
const { combineResolvers } = require('graphql-resolvers');

const { isAuthenitcated } = require('./authorization.js');

const { validateReview } = require('../util/validators');

module.exports = {
  Query: {
    async ProductReview(
      _,
      { productId: id },
      { models: { Product } },
    ) {
      try {
        const product = await Product.findById(id);
        return {
          __typename: 'Reviews',
          reviews: product.reviews,
        };
      } catch (err) {
        return {
          __typename: 'GetProductError',
          message: 'unable to get products',
        };
      }
    },
  },
  Mutation: {
    postProductReview: combineResolvers(
      isAuthenitcated,
      async (
        _,
        { id, review: { comment, stars } },
        { models: { Product }, currentUser: { email } },
      ) => {
        try {
          // vaidate review
          const { valid, reviewErrors } = validateReview(comment);
          if (!valid) {
            return {
              __typename: 'ReviewInputErrors',
              message: 'Invalid review input',
              reviewErrors,
              type: 'ReviewInputErrors',
              valid,
            };
          }

          const product = await Product.findOne({ id });

          if (!product) {
            return {
              __typename: 'GetProductError',
              message: 'Product does not exist',
              type: 'GetProductError',
            };
          }
          product.reviews.unshift({
            comment,
            stars,
            createdAt: new Date().toISOString(),
            reviewerEmail: email,
          });

          const updatedProduct = await product.save();

          const {
            comment: c,
            stars: s,
            createdAt: ca,
            _id,
          } = updatedProduct._doc.reviews[0];

          return {
            __typename: 'Review',
            comment: c,
            stars: s,
            createdAt: ca,
            reviewerEmail: email,
            id: _id,
          };
        } catch (err) {
          return {
            __typename: 'ReviewNotAddedError',
            message: 'Unable to add your review',
            type: `${err}`,
          };
        }
      },
    ),
    deleteProductReview: combineResolvers(
      isAuthenitcated,
      async (
        _,
        { productId, reviewId },
        { models: { Product }, currentUser: { email } },
      ) => {
        try {
          const product = await Product.findById(productId);
          if (!product) {
            return {
              __typename: 'GetProductError',
              message: "Product doesn't exist",
              type: 'GetProductError',
            };
          }
          // get review's index
          const reviewIndex = product.reviews.findIndex(
            (review) => review.id === reviewId,
          );
          // makesure review exists
          if (reviewIndex === -1) {
            return {
              __typename: 'ReviewDeletionError',
              message: "Review doesn't exist",
              type: 'ReviewDeletionError',
            };
          }
          // makesure current user is owner of review
          if (product.reviews[reviewIndex].reviewerEmail !== email) {
            return {
              __typename: 'ReviewOwnerError',
              message: 'Not authenticated as review owner',
              type: 'ReviewOwnerError',
            };
          }

          product.reviews.splice(reviewIndex, 1);
          product.save();
          return {
            __typename: 'DeleteProductReview',
            message: 'Successfuly deleted your review',
            type: 'DeleteProductReview',
          };
        } catch (err) {
          return {
            __typename: 'ReviewDeletionError',
            message: 'Unable to delete your review',
            type: `${err}`,
          };
        }
      },
    ),

    updateReview: combineResolvers(
      isAuthenitcated,
      async (
        _,
        { reviewId, productId, newReview: { comment, stars } },
        { models: { Product }, currentUser: { email } },
      ) => {
        try {
          // vaidate review
          const { valid, reviewErrors } = validateReview(comment);
          if (!valid) {
            return {
              __typename: 'ReviewInputErrors',
              message: 'Invalid review input',
              reviewErrors,
              type: 'ReviewInputErrors',
              valid,
            };
          }

          const product = await Product.findById(productId);
          if (!product) {
            return {
              __typename: 'GetProductError',
              message: "Product doesn't exist",
              type: 'GetProductError',
            };
          }
          // get review's index
          const reviewIndex = product.reviews.findIndex(
            (review) => review.id === reviewId,
          );
          // makesure review exists
          if (reviewIndex === -1) {
            return {
              __typename: 'UpdateProductReviewError',
              message: "Review doesn't exist",
              type: 'UpdateProductReviewError',
            };
          }
          // makesure current user is owner of review
          if (product.reviews[reviewIndex].reviewerEmail !== email) {
            return {
              __typename: 'ReviewOwnerError',
              message: 'Not authenticated as review owner',
              type: 'ReviewOwnerError',
            };
          }

          const updatedAt = new Date().toISOString();

          await Product.update(
            { 'reviews.id': reviewId },
            {
              $set: {
                'reviews.$.comment': comment,
                'reviews.$.stars': stars,
                'reviews.$.createdAt': updatedAt,
              },
            },
          );

          return {
            __typename: 'Review',
            id: product.reviews[reviewIndex].id,
            reviewerEmail: email,
            createdAt: updatedAt,
            stars,
            comment,
          };
        } catch (err) {
          return {
            __typename: 'UpdateProductReviewError',
            message: 'Unable to update your review',
            type: `${err}`,
          };
        }
      },
    ),
  },
};
