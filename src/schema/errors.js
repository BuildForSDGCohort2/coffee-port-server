const { gql } = require('apollo-server');

module.exports = gql`
  interface Error {
    message: String!
    type: String
  }

  type ProductNotAddedError implements Error {
    message: String!
    type: String
  }

  type DeleteProductPostError implements Error {
    message: String!
    type: String
  }

  type GetProductsError implements Error {
    message: String!
    type: String
  }

  type NotAuthenticatedUserError implements Error {
    message: String!
    type: String
  }
`;
