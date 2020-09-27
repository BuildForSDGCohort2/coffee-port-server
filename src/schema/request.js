const { gql } = require('apollo-server-express');

module.exports = gql`
  # mutations
  extend type Mutation {
    createProductRequest(productId: ID!): CreateProductRequestResult!
  }
  #custom types
  type Request {
    id: ID!
    createdAt: String!
    requestedBy: User!
    requestedProduct: Product!
    requestStatus: String!
  }

  #results
  union CreateProductRequestResult =
      Request
    | GetProductError
    | NotAuthenticatedUserError
    | CreateProductRequestError
`;
