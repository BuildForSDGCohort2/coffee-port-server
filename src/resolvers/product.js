/* eslint-disable no-underscore-dangle */
const { combineResolvers } = require('graphql-resolvers');

const {
  isAuthenitcated,
  isProductOwner,
} = require('./authorization.js');

module.exports = {
  Mutation: {
    postProduct: combineResolvers(
      isAuthenitcated,
      async (
        _,
        {
          product: {
            productName,
            productPrice,
            productQuantity,
            productMeasurementUnit,
            uniqueAttributes,
          },
        },
        { models: { Product }, currentUser },
      ) => {
        try {
          const newProduct = new Product({
            productName,
            productPrice,
            productQuantity,
            productMeasurementUnit,
            uniqueAttributes,
            user: currentUser,
          });

          const res = await newProduct.save();

          return {
            __typename: 'Product',
            ...res._doc,
            id: res._id,
          };
        } catch (err) {
          return {
            __typename: 'ProductNotAddedError',
            message: 'Unable to add your product.',
            type: `${err}`,
          };
        }
      },
    ),

    deleteProductPost: combineResolvers(
      isAuthenitcated,
      isProductOwner,
      async (_, { id }, { models: { Product } }) => {
        try {
          const product = await Product.findById(id);

          await product.delete();
          return {
            __typename: 'DeleteProductPost',
            message: 'Successfuly deleted product',
          };
        } catch (err) {
          return {
            __typename: 'DeleteProductPostError',
            message: 'Failed to delete product',
            type: `${err}`,
          };
        }
      },
    ),
  },

  Query: {
    async products(_, __, { models: { Product } }) {
      try {
        const products = await Product.find();
        return {
          __typename: 'Products',
          products,
        };
      } catch (err) {
        return {
          __typename: 'GetProductsError',
          message: 'Unable to get products',
          type: `${err}`,
        };
      }
    },
  },
};
