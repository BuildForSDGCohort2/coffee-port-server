const { gql } = require('apollo-server-express');

module.exports = gql`
  # mutations
  extend type Mutation {
    postReview(
      review: String!
    ): PostReviewResult!
  }
  # queries
  extend type Query {
    # reviews(filter:String): ReviewsResult
  }
  # custom types
  type Review {
    id: ID!
    user: User!
    product: Product!
    text: String!
  }


  #results
  union PostReviewResult =
      Review
    | ReviewNotAddedError
    | NotAuthenticatedUserError
  union ReviewsResult = Review | GetReviewsError


  # input types
  # input ReviewInput {
  #   product: Product!
  #   text: String!
  # }

`;
