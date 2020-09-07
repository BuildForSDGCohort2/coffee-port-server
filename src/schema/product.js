const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Mutation {
    postProduct(type: String!, name: String!): Product!
    deleteProductPost(id: ID!): String!
  }
  type Product {
    id: ID!
    name: String!
    type: String!
    userId: String!
  }
`;
