const { gql } = require('apollo-server');

module.exports = gql`
  # queries
  extend type Query {
    report(id: ID!): ReportResult
    reports: ReportsResult
  }

  # mutations
  extend type Mutation {
    reportUsers(reportedUser:reportedUserInput!, reportMessage:String!): PostReportResult!
  }

  # custom types
  type Reported {
    result: String!
    report: Report
  }

  type Report {
      id: ID!
      reporterUser: User!
      reportedUser: User!
      reportMessage: String!
  }

  type Reports {
    reports: [Report!]
  }

  #results
  union PostReportResult = Reported | UserDoesNotExist
  union ReportResult = Report | ReportDoesNotExist
  union ReportsResult = Reports | ReportsDoesNotExist

  #inputs
  input reportedUserInput {
      id:ID!
  }

`;
