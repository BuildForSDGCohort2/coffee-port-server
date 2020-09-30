const { gql } = require('apollo-server');

module.exports = gql`
  interface Error {
    message: String!
    type: String
  }

  type ReviewErrors {
    comment: String
  }

  type PurchasedProductsError implements Error {
    message: String!
    type: String
  }

  type ReportDoesNotExist implements Error {
    message: String!
    type: String
  }

  type ReportsDoesNotExist implements Error {
    message: String!
    type: String
  }

  type ResendConfirmationError implements Error {
    message: String!
    type: String
  }

  type VerifiedUserError implements Error {
    message: String!
    type: String
  }

  type PostReportError implements Error {
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

  type ProductInputError implements Error {
    message: String!
    type: String
    productErrors: ProductInputErrors!
    valid: Boolean!
  }

  type ProductInputErrors {
    productName: String
    productMeasurementUnit: String
    productQuantity: Int
    productPrice: Float
    geographicalDesignation: String
    grade: String
    group: String
    uniqueName: String
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

  type UpdateUserError implements Error {
    message: String!
    type: String
  }

  type DeleteUserError implements Error {
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

  type ProductError implements Error {
    message: String!
    type: String
  }

  type UpdateProductError implements Error {
    message: String!
    type: String
  }

  type UserDoesNotExist implements Error {
    message: String!
    type: String
  }

  type UsersError implements Error {
    message: String!
    type: String
  }

  type ReviewNotAddedError implements Error {
    message: String!
    type: String
  }

  type ReviewInputErrors implements Error {
    message: String!
    type: String
    valid: Boolean!
    reviewErrors: ReviewErrors!
  }

  type ReviewOwnerError implements Error {
    message: String!
    type: String
  }

  type ReviewDeletionError implements Error {
    message: String!
    type: String
  }

  type UpdateProductReviewError implements Error {
    message: String!
    type: String
  }

  type CreateProductRequestError implements Error {
    message: String!
    type: String
  }

  type UpdateProductRequestError implements Error {
    message: String!
    type: String
  }

  type GetRequestError implements Error {
    message: String!
    type: String
  }

  type RequestsError implements Error {
    message: String!
    type: String
  }
`;
