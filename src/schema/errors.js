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

  type TokenError implements Error {
    message: String!
    type: String
  }

  type UserInputError implements Error {
    message: String!
    type: String
    errors: UserInputErrors
    valid: Boolean!
  }

  type UserInputErrors {
    password: String
    email: String
    confirmPassword: String
  }

  type SignupError implements Error {
    message: String!
    type: String
  }
`;
