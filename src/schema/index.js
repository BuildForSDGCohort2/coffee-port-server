const { gql } = require('apollo-server-express');

const userSchema = require('./user.js');
const productSchema = require('./product.js');
const companySchema = require('./company.js');
const errorsSchema = require('./errors.js');
const reviewSchema = require('./review.js');

const linkSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

module.exports = [
  linkSchema,
  userSchema,
  productSchema,
  companySchema,
  errorsSchema,
  reviewSchema,
];
