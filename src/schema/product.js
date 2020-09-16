const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Mutation {
    postProduct(
      product: ProductInput!
      company: CompanyInput!
    ): Product!
    deleteProductPost(id: ID!): String!
  }
  extend type Query {
    products: [Product!]
  }
  type Product {
    id: ID!
    user: User!
    productName: String!
    uniqueAttributes: ProductUniqueAttributes!
  }

  type ProductUniqueAttributes {
    geographicalDesignation: String
    grade: String
    group: String
    uniqueName: String
  }

  input ProductInput {
    productName: String!
    uniqueAttributes: ProductUniqueAttributesInput!
  }

  input ProductUniqueAttributesInput {
    geographicalDesignation: String
    grade: String
    group: String
    uniqueName: String
  }
`;
