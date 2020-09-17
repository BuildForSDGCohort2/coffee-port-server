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

  type Token {
    token: String!
  }

  # results
  union CreateUserResult =
      Token
    | UserInputError
    | TokenError
    | SignupError

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
`;
