const { gql } = require('apollo-server');

module.exports = gql`
  interface Error {
    message: String!
  }

  type ProductNotAdded implements Error {
    message: String!
  }
`;
