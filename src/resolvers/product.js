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
        { models: { Product }, currentUser },
      ) => {
        try {
          const newProduct = new Product({
            productName,
            uniqueAttributes,
            user: currentUser,
          });

          const res = await newProduct.save();
          console.log(res);
          return {
            ...res._doc,
            id: res._id,
            message: 'You have successfully added your product',
          };
        } catch (err) {
          console.log(err);
          return {
            __typename: 'PostProductMutationPayload',
            code: 'custom code',
            message: 'Sorry failed to post your product',
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
          return 'Deletion successful';
        } catch (err) {
          throw new Error(err);
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
