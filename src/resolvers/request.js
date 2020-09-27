const { combineResolvers } = require('graphql-resolvers');

const { pubsub, EVENTS } = require('../subscription');
const { isAuthenitcated } = require('./authorization.js');

module.exports = {
  Mutation: {
    createProductRequest: combineResolvers(
      isAuthenitcated,
      async (
        _,
        { productId },
        { models: { Request, Product }, currentUser },
      ) => {
        try {
          // validate if product exists already

          const product = await Product.findById(productId).exec(
            (err) => {
              if (err) {
                return {
                  __typename: 'GetProductError',
                  type: 'GetProductError',
                  message: 'Product does not exist',
                };
              }
            },
          );

          const productRequest = new Request({
            requestStatus: EVENTS.REQUEST.REQUESTED,
            requestedBy: currentUser.id,
            requestedProduct: productId,
            createdAt: new Date().toISOString(),
          });

          await productRequest.save();

          await Request.findById(productRequest._doc._id)
            .populate('requestedBy')
            .exec((err, res) => {
              if (err) {
                return {
                  __typename: 'CreateProductRequestError',
                  type: 'CreateProductRequestError',
                  message: `${err}`,
                };
              }

              return {
                __typename: 'Request',
                id: res._doc._id,
                ...res._doc,
                requestedProduct: product,
              };
            });
        } catch (err) {
          return {
            __typename: 'CreateProductRequestError',
            type: `${err}`,
            message: 'unable to get product',
          };
        }
      },
    ),
  },
};
