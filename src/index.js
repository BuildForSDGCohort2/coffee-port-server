// add your dependecy imports here
require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
// const express = require('express');
// const cors = require('cors');

// add your relative imports here
const schema = require('./schema');
const resolvers = require('./resolvers');
const models = require('./models');

// const app = express();
// app.use(cors());

// PORT
const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    models,
    secret: process.env.SECRET,
  },
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
