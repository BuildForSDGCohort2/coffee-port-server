const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { validateSignUpInput } = require('../util/validators');
const {
  generatePasswordHash,
  createToken,
} = require('../util/helpers');
const { emit } = require('../models/User');

module.exports = {
  Query: {
    async users(parent, args, { models: { User } }) {
      try {
        const users = await User.find();
        return users;
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    async createUser(
      parent,
      { userInput: { email, password, confirmPassword } },
      { models: { User }, secret },
    ) {
      // validate user input
      const { errors, valid } = validateSignUpInput(
        password,
        confirmPassword,
        email,
      );
      // if not valid input
      if (!valid) {
        throw new UserInputError('Invalid user input', { errors });
      }
      try {
        // make sure email is unique
        const user = await User.findOne({ email });
        if (user) {
          //email is not unique
          throw new UserInputError('Email already exists', {
            errors: {
              email: 'Email already exists',
            },
          });
        }
        // hash password
        // eslint-disable-next-line no-param-reassign
        password = generatePasswordHash();

        const newUser = new User({
          email,
          password,
        });
        const res = await newUser.save();
        return {
          token: createToken(res, secret, '30m'),
        };
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
