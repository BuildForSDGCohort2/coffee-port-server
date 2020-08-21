// add your dependecy imports here
const { ApolloServer } = require("apollo-server");
const gql = require("graphql-tag");
const mongoose = require("mongoose");

// add your relative imports here
const { MONGO_ATLAS_DB_CONNECTION_STRING } = require("./config");

// PORT
const PORT = process.env.port || 5000;

const typeDefs = gql`
  type Query {
    getTestMessage: String!
  }
`;

const resolvers = {
  Query: {
    getTestMessage: () => "#ITSMYDAM",
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

mongoose
  .connect(MONGO_ATLAS_DB_CONNECTION_STRING, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Mongo db connected!");
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`Running at  ${res.url}`);
  })
  .catch((err) => {
    console.log(err);
  });
