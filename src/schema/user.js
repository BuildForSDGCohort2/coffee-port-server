const { gql } = require('apollo-server');

module.exports = gql`
  # queries
  extend type Query {
    user(id: ID!): UserResult
    users(role: String): UsersResult
  }

  # mutations
  extend type Mutation {
    createUser(userInput: SignUpUserInput!): CreateUserResult!
    updateUser(
      id: ID!
      updateUserInput: UpdateUserInput!
    ): UpdatedUserResult!
    deleteUser(id: ID!): DeleteUserResult!
    signIn(email: String!, password: String!): SignInResult!
    verifyUser(token: String!): VerifyResult!
    resendConfirmation: ResendConfirmationResult!
  }

  # custom types
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    role: String!
    company: Company!
    phoneNumber: String!
    createdAt: String
    isVerified: Boolean
    products: [Product!]
  }

  type Users {
    users: [User!]
  }

  type UpdatedUser {
    user: User!
    token: String!
  }

  type Token {
    token: String!
  }

  type DeletedUserMessage {
    message: String!
    userId: String!
  }

  type VerifiedMessage {
    token: String!
    message: String!
  }

  type ResendConfirmation {
    message: String!
  }

  # results
  union CreateUserResult =
      Token
    | UserInputError
    | TokenError
    | SignupError

  union UpdatedUserResult =
      UpdatedUser
    | UserInputError
    | TokenError
    | UpdateUserError
    | NotAuthenticatedUserError

  union DeleteUserResult =
      DeletedUserMessage
    | DeleteUserError
    | NotAuthenticatedUserError

  union SignInResult =
      Token
    | UserInputError
    | SignInError
    | TokenError

  union UserResult = User | UserDoesNotExist
  union UsersResult = Users | UsersError
  union VerifyResult =
      VerifiedMessage
    | TokenError
    | VerifiedUserError

  union ResendConfirmationResult =
      ResendConfirmation
    | ResendConfirmationError
    | VerifiedUserError
  # inputs
  input SignUpUserInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    confirmPassword: String!
    role: String!
    phoneNumber: String!
    company: CompanyInput!
  }

  input UpdateUserInput {
    email: String
    password: String
    firstName: String
    lastName: String
    confirmPassword: String
    role: String
    isVerified: Boolean
    phoneNumber: String
    company: UpdateCompanyInput
  }
`;
