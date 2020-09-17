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
        parent,
        { product: { productName, uniqueAttributes } },
        { models: { Product }, currentUser, test },
      ) => {
        try {
          const newProduct = new Product({
            productName,
            uniqueAttributes,
            user: currentUser,
            test,
          });

          const res = await newProduct.save();

          return {
            __typename: 'Product',
            ...res._doc,
            id: res._id,
            status: tesst,
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
      async (parent, { id }, { models: { Product } }) => {
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
    async products(parent, args, { models: { Product } }) {
      try {
        const products = await Product.find();
        return products;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
