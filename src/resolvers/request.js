const { combineResolvers } = require('graphql-resolvers');

const { isAuthenitcated } = require('./authorization.js');

module.exports = {
  Query: {
    async request(_, { requestId }, { models: { Request } }) {
      try {
        const request = await Request.findById(requestId)
          .populate('requestedBy')
          .populate('requestedProduct');
        if (!request) {
          return {
            __typename: 'GetRequestError',
            type: 'GetRequestError',
            message: 'Request does not exist',
          };
        }

        return {
          __typename: 'Request',
          id: request._doc._id,
          ...request._doc,
        };
      } catch (err) {
        return {
          __typename: 'RequestError',
          type: 'RequestError',
          message: 'Unale to get your request',
        };
      }
    },
    async requests(_, __, { models: { Request } }) {
      try {
        const requests = await Request.find()
          .populate('requestedBy')
          .populate('requestedProduct');
        return {
          __typename: 'Requests',
          requests,
        };
      } catch (err) {
        return {
          __typename: 'RequestsError',
          message: 'Unable to get requests',
          type: `${err}`,
        };
      }
    },
  },
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
          const product = await Product.findById(productId);

          if (!product) {
            return {
              __typename: 'GetProductError',
              type: 'GetProductError',
              message: 'Product does not exist',
            };
          }

          const productRequest = new Request({
            requestStatus: EVENTS.REQUEST.REQUESTED,
            requestedBy: currentUser.id,
            requestedProduct: productId,
            createdAt: new Date().toISOString(),
          });

          await productRequest.save();

          const repon = await Request.findById(
            productRequest._id,
            (err, res) => {
              if (err) {
                console.log(err);
              } else {
                console.log(res);
              }
            },
          )
            .populate('requestedBy')
            .populate('requestedProduct')
            .exec();

          return {
            __typename: 'Request',
            id: repon._doc._id,
            ...repon._doc,
          };
        } catch (err) {
          return {
            __typename: 'CreateProductRequestError',
            message: 'Unable to send request',
            type: `${err}`,
          };
        }
      },
    ),

    deleteProductRequest: combineResolvers(
      isAuthenitcated,
      async (
        _,
        { requestId },
        { models: { Request }, currentUser },
      ) => {
        try {
          const request = await Request.findById(requestId).populate(
            'requestedBy',
          );
          if (!request) {
            return 'requested does not exist';
          }
          if (request._doc.requestedBy.email !== currentUser.email) {
            return 'Not authenticated as owner of request';
          }
          await Request.deleteOne({ _id: requestId });

          return 'Deleted';
        } catch (err) {
          console.log(err);
        }
      },
    ),

    updateProductRequest: combineResolvers(
      isAuthenitcated,
      async (
        _,
        { requestId, requestStatus },
        { models: { Request }, currentUser },
      ) => {
        try {
          const request = await Request.findById(requestId)
            .populate('requestedBy')
            .populate('requestedProduct')
            .exec();
          if (request) {
            request.requestStatus = requestStatus;
            request.acceptedByOrDeclinedBy = currentUser.id;
            const updatedRequest = await request.save();
            console.log(updatedRequest);
            return {
              __typename: 'Request',
              ...updatedRequest._doc,
              id: updatedRequest._doc._id,
            };
          }
          return {
            __typename: 'GetProductError',
            type: 'GetProductError',
            message: 'Product does not exist',
          };
        } catch (err) {
          return {
            __typename: 'UpdateProductRequestError',
            type: 'UpdateProductRequestError',
            message: 'Unable to update request',
          };
        }
      },
    ),
  },
};
