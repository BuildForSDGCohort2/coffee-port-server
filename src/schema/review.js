const { gql } = require('apollo-server-express');

module.exports = gql`
  # mutations
  extend type Mutation {
    postProductReview(
      productId: ID!
      review: ReviewInput!
    ): PostProductReviewResult!

    deleteProductReview(
      productId: ID!
      reviewId: ID!
    ): DeleteProductReviewResult!

    updateReview(
      reviewId: String!
      productId: String!
      newReview: ReviewInput!
    ): UpdateProductReviewResult!
  }
  # query
  extend type Query {
    ProductReview(productId: ID!): ProductReviewResult
  }

  # custom types
  type Review {
    id: ID!
    reviewerEmail: String!
    comment: String!
    stars: Float!
    createdAt: String!
  }

  type Reviews {
    reviews: [Review!]
  }

  type DeleteProductReview {
    message: String!
  }

  #results
  union ProductReviewResult = Reviews | GetProductError
  union PostProductReviewResult =
      Review
    | ReviewNotAddedError
    | NotAuthenticatedUserError
    | ReviewInputErrors
    | GetProductError

  union DeleteProductReviewResult =
      DeleteProductReview
    | GetProductError
    | ReviewOwnerError
    | ReviewDeletionError
    | NotAuthenticatedUserError

  union UpdateProductReviewResult =
      Review
    | GetProductError
    | NotAuthenticatedUserError
    | ReviewOwnerError
    | UpdateProductReviewError
    | ReviewInputErrors

  # input types
  input ReviewInput {
    comment: String!
    stars: Float!
  }
`;
