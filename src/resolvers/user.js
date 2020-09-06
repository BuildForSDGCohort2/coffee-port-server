const { UserInputError } = require('apollo-server');
const { combineResolvers } = require('graphql-resolvers');

const {
  validateSignUpInput,
  validateLoginInput,
} = require('../util/validators');
const { createToken } = require('../util/helpers');
const { isAdmin } = require('./authorization.js');

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
      { userInput: { email, password, role, confirmPassword } },
      { models: { User }, secret },
    ) {
      try {
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

        // make sure email is unique
        const user = await User.findOne({ email });
        if (user) {
          // email is not unique
          throw new UserInputError('Email already exists', {
            errors: {
              email: 'Email already exists',
            },
          });
        }
        // hash password : use the static method u added on User schema
        // eslint-disable-next-line no-param-reassign
        password = await User.generatePasswordHash(password);

        const newUser = new User({
          email,
          password,
          createdAt: new Date().toISOString(),
          role,
        });

        const res = await newUser.save();
        return {
          token: createToken(res, secret, '30m'),
        };
      } catch (err) {
        throw new Error(err);
      }
    },

    async signIn(
      _,
      { email, password },
      { models: { User }, secret },
    ) {
      // validate login input
      const { errors, valid } = validateLoginInput(email, password);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      // see if user exists
      const user = await User.findOne({ email });
      if (!user) {
        errors.userNotFound = 'User not found';
        throw new UserInputError('User not found');
      }

      // compare password : using static method on User schema
      const match = await User.validatePassword(
        password,
        user.password,
      );

      if (!match) {
        errors.general = 'Wrong credentials';
        throw new UserInputError('Wrong credentials');
      }

      return {
        token: createToken(user, secret, '30m'),
      };
    },

    deleteUser: combineResolvers(
      isAdmin,
      async (parent, { email }, { models: { User } }) => {
        try {
          const user = await User.findOne({ email });

          await user.delete();

          return 'user deleted!';
        } catch (error) {
          console.log(error);
          return 'failed to delete user';
        }
      },
    ),
  },
};
