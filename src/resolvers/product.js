/* eslint-disable no-underscore-dangle */
const { combineResolvers } = require('graphql-resolvers');

const {
  isAuthenitcated,
  isProductOwner,
  isverified,
} = require('./authorization.js');

const { validateProductInput } = require('../util/validators');

module.exports = {
  Mutation: {
    postProduct: combineResolvers(
      isAuthenitcated,
      // isverified,
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
          if (currentUser.role !== 'SUPPLIER') {
            return {
              __typename: 'ProductNotAddedError',
              message:
                'Your role need to be Supplier in order to post product',
              type: 'ProductNotAddedError',
            };
          }
          const newProduct = new Product({
            ...product,
            user: currentUser.id,
          });

          const res = await newProduct.save();

          const prod = await Product.findById(res._doc._id).populate(
            'user',
          );

          return {
            __typename: 'Product',
            ...prod._doc,
            id: res._doc._id,
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
      async (_, { id }, { models: { Product, Request } }) => {
        try {
          const product = await Product.findById(id);
          // check if product has any associated requests
          const request = await Request.findOne({
            requestedProduct: product.id,
          });
          if (request) {
            await request.delete();
          }
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
          }).populate('user');
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

  Query: {
    async products(_, { filter }, { models: { Product } }) {
      try {
        const products = await Product.find().populate('user');
        if (!filter) {
          return {
            __typename: 'Products',
            products,
          };
        }
        return {
          __typename: 'Products',
          products: products.filter((product) =>
            product.productName
              .toLowerCase()
              .includes(filter.toLowerCase()),
          ),
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
        const product = await Product.findById(id).populate('user');
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
    async purchasedProducts(_, { id }, { models: { Product } }) {
      try {
        const products = await Product.find({ user: id }).populate(
          'user',
        );

        const purchasedProducts = products.filter(
          (product) => product.purchased === true,
        );
        const amount = purchasedProducts.length;
        return {
          __typename: 'PurchasedProducts',
          products: purchasedProducts,
          amount,
        };
      } catch (err) {
        return {
          __typename: 'PurchasedProductsError',
          message: 'PurchasedProductsError',
          type: `${err}`,
        };
      }
    },
  },
};
