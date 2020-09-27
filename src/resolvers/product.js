/* eslint-disable no-underscore-dangle */
const { combineResolvers } = require('graphql-resolvers');

const {
  isAuthenitcated,
  isProductOwner,
} = require('./authorization.js');

const { pubsub, EVENTS } = require('../subscription');

const { validateProductInput } = require('../util/validators');

module.exports = {
  Mutation: {
    postProduct: combineResolvers(
      isAuthenitcated,
      async (
        _,
        { product },
        { models: { Product }, currentUser },
      ) => {
        try {
          const { productErrors, valid } = validateProductInput(
            product,
          );
          if (!valid) {
            return {
              __typename: 'ProductInputError',
              message: 'Invalid product input',
              productErrors,
              valid,
            };
          }
          const newProduct = new Product({
            ...product,
            user: currentUser,
          });

          const res = await newProduct.save();
          console.log(EVENTS.REQUEST);
          pubsub.publish(EVENTS.REQUEST.REQUESTED, {
            productCreated: { ...res._doc, id: res._id },
          });
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
    updateProduct: combineResolvers(
      isAuthenitcated,
      isProductOwner,
      async (
        _,
        { id, productToBeUpdated },
        { models: { Product } },
      ) => {
        try {
          const { productErrors, valid } = validateProductInput(
            productToBeUpdated,
          );
          if (!valid) {
            return {
              __typename: 'ProductInputError',
              message: 'Invalid product input',
              productErrors,
              valid,
            };
          }

          const { uniqueAttributes, ...args } = productToBeUpdated;
          const product = await Product.findByIdAndUpdate(id, args, {
            new: true,
          });
          if (uniqueAttributes !== undefined) {
            const uniqueAttr = Object.entries(uniqueAttributes);
            uniqueAttr.forEach((array) => {
              const keys = array[0];
              const values = array[1];
              product.uniqueAttributes[keys] = values;
            });
            product.save();
          }
          return {
            __typename: 'Product',
            ...product._doc,
            id: product._doc._id,
          };
        } catch (err) {
          return {
            __typename: 'UpdateProductError',
            message: 'Unable to update product',
            type: `${err}`,
          };
        }
      },
    ),
  },

  Subscription: {
    productCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.REQUEST.REQUESTED),
    },
  },

  Query: {
    async products(_, { filter }, { models: { Product } }) {
      try {
        const products = await Product.find();
        if (!filter) {
          return {
            __typename: 'Products',
            products,
          };
        }
        return {
          __typename: 'Products',
          products: products.filter((product) => {
            const productName = product.productName
              .toLowerCase()
              .includes(filter);
            const group = product.uniqueAttributes.group
              .toLowerCase()
              .includes(filter);
            const uniqueName = product.uniqueAttributes.uniqueName
              .toLowerCase()
              .includes(filter);
            return productName || group || uniqueName;
          }),
        };
      } catch (err) {
        return {
          __typename: 'GetProductsError',
          message: 'Unable to get products',
          type: `${err}`,
        };
      }
    },

    async product(_, { id }, { models: { Product } }) {
      try {
        const product = await Product.findById(id);
        return {
          __typename: 'Product',
          ...product._doc,
          id: product._doc._id,
        };
      } catch (err) {
        return {
          __typename: 'GetProductError',
          message: 'Unable to get product',
          type: `${err}`,
        };
      }
    },
  },
};
