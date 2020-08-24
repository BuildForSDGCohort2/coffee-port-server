// add your dependecy imports here
const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');

require('dotenv').config();

// add your relative imports here

// PORT
const PORT = process.env.PORT || 5000;

const typeDefs = gql`
  type Query {
    getTestMessage: String!
  }
`;

const resolvers = {
  Query: {
    getTestMessage: () => '#ITSMYDAM',
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

mongoose
  .connect(process.env.MONGO_ATLAS_DB_CONNECTION_STRING, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Mongo db connected!');
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`Running at  ${res.url}`);
  })
  .catch((err) => {
    console.log(err);
  });
