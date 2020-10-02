const { combineResolvers } = require('graphql-resolvers');

const { isAuthenitcated } = require('./authorization.js');

module.exports = {
  Query: {
    request: combineResolvers(
      isAuthenitcated,
      async (_, { requestId }, { models: { Request } }) => {
        try {
          const request = await Request.findById(requestId)
            .populate('requestedBy')
            .populate('requestedProduct')
            .populate('productOwner');
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
    ),
    requests: combineResolvers(
      isAuthenitcated,
      async (
        _,
        { byBuyerId, bySellerId },
        { models: { Request } },
      ) => {
        try {
          if (byBuyerId) {
            const requests = await Request.find({
              requestedBy: byBuyerId,
            })
              .populate('requestedBy')
              .populate('productOwner')
              .populate('requestedProduct');
            return {
              __typename: 'Requests',
              requests,
            };
          }
          if (bySellerId) {
            const requests = await Request.find({
              productOwner: bySellerId,
            })
              .populate('requestedBy')
              .populate('productOwner')
              .populate('requestedProduct');
            if (!requests) {
              return {
                __typename: 'RequestsError',
                message:
                  'Current user has no any accepted or declined requests',
                type: 'RequestsError',
              };
            }
            return {
              __typename: 'Requests',
              requests,
            };
          }
          const requests = await Request.find()
            .populate('requestedBy')
            .populate('productOwner')
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
    ),
  },
  Mutation: {
    createProductRequest: combineResolvers(
      isAuthenitcated,
      async (
        _,
        { productId, inquiryText },
        { models: { Request, Product }, currentUser },
      ) => {
        try {
          // validate if product exists
          const product = await Product.findById(productId);

          if (!product) {
            return {
              __typename: 'GetProductError',
              type: 'GetProductError',
              message: 'Product does not exist',
            };
          }

          if (currentUser.role !== 'BUYER') {
            return {
              __typename: 'CreateProductRequestError',
              message:
                'Your role must be Buyer to send request to product',
              type: 'CreateProductRequestError',
            };
          }

          const isAlreadyRequested = await Request.findOne({
            requestedBy: currentUser.id,
            requestedProduct: productId,
          });

          if (isAlreadyRequested) {
            return {
              __typename: 'CreateProductRequestError',
              message:
                'Your have already sent request to this product',
              type: 'CreateProductRequestError',
            };
          }

          const productRequest = new Request({
            requestStatus: 'REQUESTED',
            requestedBy: currentUser.id,
            requestedProduct: productId,
            inquiryText,
            createdAt: new Date().toISOString(),
            productOwner: product.user,
          });

          await productRequest.save();

          const repon = await Request.findById(productRequest._id)
            .populate('requestedBy')
            .populate('requestedProduct')
            .populate('productOwner')
            .exec();

          return {
            __typename: 'Request',
            id: repon._doc._id,
            ...repon._doc,
          };

          // check if already requested
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
            return 'requested product does not exist';
          }
          if (request._doc.requestedBy.email !== currentUser.email) {
            return 'Not authenticated as owner of request';
          }
          await Request.deleteOne({ _id: requestId });

          return 'Deleted';
        } catch (err) {
          return 'Unknow error happened while deleting your request';
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
          const request = await Request.findById(requestId);
          if (!request) {
            return {
              __typename: 'GetRequestError',
              type: 'GetRequestError',
              message: 'Request does not exist',
            };
          }
          if (request.productOwner.toString() !== currentUser.id) {
            return {
              __typename: 'UpdateProductRequestError',
              type: 'UpdateProductRequestError',
              message:
                'Your are not the owner of the product the request is sent for',
            };
          }

          request.requestStatus = requestStatus;
          request.createdAt = new Date().toISOString();
          await request.save();

          return {
            __typename: 'UpdateRequestSuccess',
            message: 'Successfuly updated request',
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
