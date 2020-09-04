const { gql } = require('apollo-server');

module.exports = gql`
  extend type Query {
    user(id: ID!): User
    users: [User!]
  }

  extend type Mutation {
    createUser(userInput: SignUpUserInput!): Token!
    signIn(email: String!, password: String!): Token!
  }

  type User {
    id: ID!
    email: String!
  }

  type Token {
    token: String!
  }

  input SignUpUserInput {
    email: String!
    password: String!
    confirmPassword: String!
  }
`;
