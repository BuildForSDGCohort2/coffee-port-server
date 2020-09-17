const { gql } = require('apollo-server-express');

module.exports = gql`
  # mutations
  extend type Mutation {
    postProduct(
      product: ProductInput!
      company: CompanyInput!
    ): PostProductResult!
    deleteProductPost(id: ID!): DeleteProductPostResult!
  }
  # queries
  extend type Query {
    products: ProductsResult
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

  type DeleteProductPost {
    message: String!
  }

  type Products {
    products: [Product!]
  }

  #results
  union PostProductResult =
      Product
    | ProductNotAddedError
    | NotAuthenticatedUserError
  union DeleteProductPostResult =
      DeleteProductPost
    | DeleteProductPostError
    | NotAuthenticatedUserError
    | ProductOwnerError
  union ProductsResult = Products | GetProductsError
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
