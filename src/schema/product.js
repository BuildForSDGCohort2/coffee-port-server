const { gql } = require('apollo-server-express');

module.exports = gql`
  # mutations
  extend type Mutation {
    postProduct(
      product: ProductInput!
      company: CompanyInput!
    ): Product!
    deleteProductPost(id: ID!): String!
  }
  # queries
  extend type Query {
    products: [Product!]
  }
  # custom types
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
  #results
  union PostProductResult = Product | ProductNotAddedError

  # input types
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
