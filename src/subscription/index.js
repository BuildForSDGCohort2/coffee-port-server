const { PubSub } = require('apollo-server');

const { ACCEPTED, DECLINED, REQUESTED } = require('./request.js');

console.log(ACCEPTED);

const EVENTS = {
  REQUEST: {
    ACCEPTED,
    DECLINED,
    REQUESTED,
  },
};

const pubsub = new PubSub();

module.exports = { EVENTS, pubsub };
