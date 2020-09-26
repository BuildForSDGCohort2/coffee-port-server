const { gql } = require('apollo-server');

module.exports = gql`
  type Company {
    id: ID!
    websiteUrl: String
    companyName: String!
    companyEmail: String!
    address: Address!
  }

  type Address {
    country: String!
    city: String!
    street: String!
    postalCode: String
  }

  input CompanyInput {
    websiteUrl: String
    companyName: String!
    companyEmail: String!
    address: AddressInput!
  }

  input UpdateCompanyInput {
    websiteUrl: String
    companyName: String
    companyEmail: String
    address: UpdateAddressInput
  }

  input AddressInput {
    country: String!
    city: String!
    street: String!
    postalCode: String
  }

  input UpdateAddressInput {
    country: String
    city: String
    street: String
    postalCode: String
  }
`;
