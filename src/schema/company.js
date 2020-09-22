const { gql } = require('apollo-server');

module.exports = gql`
  type Company {
    id: ID!
    websiteUrl: String
    companyName: String!
    companyEmail: String!
    address: Address!
    products: [String!]
  }

  type Address {
    country: String!
    city: String!
    postalCode: String
  }

  input CompanyInput {
    websiteUrl: String
    companyName: String!
    companyEmail: String!
    address: AddressInput!
    products: [String!]
  }

  input AddressInput {
    country: String!
    city: String!
    postalCode: String
  }
`;
