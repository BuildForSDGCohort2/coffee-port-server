const { gql } = require('apollo-server');

module.exports = gql`
  interface Error {
    message: String!
  }

  type ProductNotAddedError implements Error {
    message: String!
  }
`;