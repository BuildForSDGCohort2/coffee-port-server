const { gql } = require('apollo-server-express');

module.exports = gql`
  # mutations
  extend type Mutation {
    createProductRequest(
      productId: ID!
      inquiryText: String
    ): CreateProductRequestResult!
    updateProductRequest(
      requestId: ID!
      requestStatus: String!
    ): UpdateProductRequestResult!

    deleteProductRequest(requestId: ID!): String!
    updateSeenStatus(requestId: ID!, isProductOwner: Boolean!): String!
  }
  #queries
  extend type Query {
    request(requestId: ID!): RequestResult!
    requests(bySellerId: ID, byBuyerId: ID): RequestsResult!
  }
  #custom types
  type Request {
    id: ID!
    createdAt: String!
    requestedBy: User!
    requestedProduct: Product!
    requestStatus: String!
    productOwner: User
    inquiryText: String
    seenByRequester: String
    seenByProductOwner: String
  }
  type Requests {
    requests: [Request!]
  }
  type UpdateRequestSuccess {
    message: String!
  }
  #results
  union CreateProductRequestResult =
      Request
    | GetProductError
    | NotAuthenticatedUserError
    | CreateProductRequestError

  union UpdateProductRequestResult =
      UpdateRequestSuccess
    | GetRequestError
    | NotAuthenticatedUserError
    | UpdateProductRequestError

  union RequestResult =
      Request
    | GetRequestError
    | NotAuthenticatedUserError

  union RequestsResult =
      Requests
    | NotAuthenticatedUserError
    | RequestsError
`;
