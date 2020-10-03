const { gql } = require('apollo-server-express');

module.exports = gql`
  # mutations
  extend type Mutation {
    postProduct(product: ProductInput!): PostProductResult!
    deleteProductPost(id: ID!): DeleteProductPostResult!
    updateProduct(
      id: ID!
      productToBeUpdated: updateProductInput!
    ): UpdateProductResult!
  }
  # queries
  extend type Query {
    products(filter: String): ProductsResult
    product(id: ID!): ProductResult
    purchasedProducts(id: ID!): PurchasedProductsResult!
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
    purchased: Boolean
    reviews: [Review!]
  }

  type ProductUniqueAttributes {
    geographicalDesignation: String
    grade: String
    group: String
    uniqueName: String
    flowerType: String
  }

  type DeleteProductPost {
    message: String!
  }

  type Products {
    products: [Product!]
  }

  type PurchasedProducts {
    products: [Product!]
    amount: Int!
  }

  #results
  union PostProductResult =
      Product
    | ProductNotAddedError
    | ProductInputError
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
    | ProductInputError
    | ProductOwnerError
  union PurchasedProductsResult =
      PurchasedProducts
    | PurchasedProductsError
  # input types
  input ProductInput {
    productName: String!
    uniqueAttributes: ProductUniqueAttributesInput!
    productPrice: Float!
    productMeasurementUnit: String!
    productQuantity: Int!
    purchased: Boolean
  }

  input ProductUniqueAttributesInput {
    geographicalDesignation: String
    grade: String
    group: String
    uniqueName: String
    flowerType: String
  }

  input updateProductInput {
    productName: String
    productMeasurementUnit: String
    productQuantity: Int
    productPrice: Float
    purchased: Boolean
    uniqueAttributes: ProductUniqueAttributesInput
  }
`;
