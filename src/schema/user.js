const { gql } = require('apollo-server');

module.exports = gql`
  # queries
  extend type Query {
    user(id: ID!): UserResult
    users: [User!]
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
    phoneNumber: String
    company: UpdateCompanyInput
  }
`;
