const { UserInputError, ForbiddenError } = require('apollo-server');
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
        { product: { productName, uniqueAttributes }, company },
        { models: { Product }, currentUser: { email, role } },
      ) => {
        try {
          const newProduct = new Product({
            productName,
            uniqueAttributes,
            user: {
              email,
              role,
              company,
            },
          });

          const res = await newProduct.save();

          return {
            ...res._doc,
            id: res._id,
          };
        } catch (err) {
          console.log(err);
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
