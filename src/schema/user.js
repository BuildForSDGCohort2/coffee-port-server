const { gql } = require('apollo-server');

module.exports = gql`
  extend type Query {
    user(id: ID!): User
    users: [User!]
  }

  extend type Mutation {
    createUser(userInput: SignUpUserInput!): Token!
    signIn(email: String!, password: String!): Token!
    deleteUser(email: String!): String!
  }

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
