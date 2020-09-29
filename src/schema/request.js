const { gql } = require('apollo-server-express');

module.exports = gql`
  # mutations
  extend type Mutation {
    createProductRequest(productId: ID!): CreateProductRequestResult!
    updateProductRequest(
      requestId: ID!
      requestStatus: String!
    ): UpdateProductRequestResult!

    deleteProductRequest(requestId: ID!): String!
  }
  #queries
  extend type Query {
    request(requestId: ID!): RequestResult!
    requests: RequestsResult!
  }
  #custom types
  type Request {
    id: ID!
    createdAt: String!
    requestedBy: User!
    requestedProduct: Product!
    requestStatus: String!
    acceptedByOrDeclinedBy: String
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
    | GetProductError
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
