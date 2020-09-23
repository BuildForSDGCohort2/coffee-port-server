const { gql } = require('apollo-server-express');

module.exports = gql`
  # mutations
  extend type Mutation {
    postProduct(
      product: ProductInput!
      company: CompanyInput!
    ): PostProductResult!
    deleteProductPost(id: ID!): DeleteProductPostResult!
    updateProduct(
      id: ID!
      productToBeUpdated: updateProductInput!
    ): UpdateProductResult!
  }
  # queries
  extend type Query {
    products(filter:String): ProductsResult
    product(id:ID!):ProductResult
  }
  # custom types
  type Product {
    id: ID!
    user: User!
    productName: String!
    productMeasurementUnit: String!
    productQuantity: Int!
    uniqueAttributes: ProductUniqueAttributes!
    productPrice: Float!
    reviews: [Review!]!
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
  union ProductResult = Product | GetProductError
  union UpdateProductResult =
      Product
    | UpdateProductError
    | ProductOwnerError

  # input types
  input ProductInput {
    productName: String!
    uniqueAttributes: ProductUniqueAttributesInput!
    productPrice: Float!
    productMeasurementUnit: String!
    productQuantity: Int!
  }
  input updateProductInput {
    productName: String
    productMeasurementUnit: String
    productQuantity: Int
    productPrice: Float
    uniqueAttributes: ProductUniqueAttributesInput
  }

  input ProductUniqueAttributesInput {
    geographicalDesignation: String
    grade: String
    group: String
    uniqueName: String
  }
`;
