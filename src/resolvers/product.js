const { UserInputError, ForbiddenError } = require('apollo-server');
const { combineResolvers } = require('graphql-resolvers');

const {
  isAuthenitcated,
  isProductOwner,
} = require('./authorization.js');
const User = require('../models/User.js');

module.exports = {
  Mutation: {
    postProduct: combineResolvers(
      isAuthenitcated,
      async (
        parent,
        { type, name },
        { models: { Product }, currentUser },
      ) => {
        // if (!currentUser) {
        //   throw new ForbiddenError('Not authenticated as User');
        // }
        const newProduct = new Product({
          type,
          name,
          userId: currentUser.id,
        });

        const res = await newProduct.save();

        return {
          ...res._doc,
          id: res._id,
        };
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
};
