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
      inquiryText: String
    ): UpdateProductRequestResult!

    deleteProductRequest(requestId: ID!): String!
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
    acceptedByOrDeclinedBy: String
    inquiryText: String
  }
  type Requests {
    requests: [Request!]
  }
  #results
  union CreateProductRequestResult =
      Request
    | GetProductError
    | NotAuthenticatedUserError
    | CreateProductRequestError

  union UpdateProductRequestResult =
      Request
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
