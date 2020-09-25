const { gql } = require('apollo-server-express');

module.exports = gql`
  # mutations
  extend type Mutation {
    postProductReview(
      productId: ID!
      review: ReviewInput!
    ): PostProductReviewResult!
  }

  # custom types
  type Review {
    id: ID!
    reviewerEmail: String!
    comment: String!
    stars: Float!
    createdAt: String!
  }
  #results
  union PostProductReviewResult =
      Review
    | ReviewNotAddedError
    | NotAuthenticatedUserError
    | ReviewInputErrors
    | GetProductError

  # input types
  input ReviewInput {
    comment: String!
    stars: Float!
  }
`;
