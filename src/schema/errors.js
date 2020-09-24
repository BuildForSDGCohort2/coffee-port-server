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
  
  type GetProductError implements Error {
    message: String!
    type: String
  }

  type UpdateProductError implements Error {
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
    userErrors: UserInputErrors!
    valid: Boolean!
  }

  type UserInputErrors {
    email: String
    password: String
    firstName: String
    lastName: String
    confirmPassword: String
    role: String
    phoneNumber: String

    websiteUrl: String
    companyName: String
    companyEmail: String

    country: String
    city: String
    street: String
    postalCode: String
  }

  type SignupError implements Error {
    message: String!
    type: String
  }

  type UpdateUserError implements Error{
    message: String!
    type: String
  }

  type SignInError implements Error {
    message: String!
    type: String
  }

  type ProductOwnerError implements Error {
    message: String!
    type: String
  }
`;
