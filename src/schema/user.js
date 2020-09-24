const { gql } = require('apollo-server');

module.exports = gql`
  # queries
  extend type Query {
    user(id: ID!): User
    users: [User!]
  }

  # mutations
  extend type Mutation {
    createUser(userInput: SignUpUserInput!): CreateUserResult!
    updateUser(
      id: ID!
      updateUserInput: UpdateUserInput!
    ): UpdatedUserResult!
    signIn(email: String!, password: String!): SignInResult!
  }

  # custom types
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    role: String
    company: Company!
    phoneNumber: String!
    createdAt: String
  }

  type UpdatedUser {
    user: User!
    token: String!
  }

  type Token {
    token: String!
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

  union SignInResult =
      Token
    | UserInputError
    | SignInError
    | TokenError

  # inputs
  input SignUpUserInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    confirmPassword: String!
    role: String
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
