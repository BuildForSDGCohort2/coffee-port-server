const { combineResolvers } = require('graphql-resolvers');
const {
  validateSignUpInput,
  validateLoginInput,
  validateUpdateUserInput,
} = require('../util/validators');
const { createToken } = require('../util/helpers');
const { isAuthenitcated } = require('./authorization');

module.exports = {
  Query: {
    async users(_, __, { models: { User } }) {
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
      _,
      {
        userInput: {
          email,
          password,
          role,
          confirmPassword,
          phoneNumber,
          company,
          firstName,
          lastName,
        },
      },
      { models: { User }, secret },
    ) {
      try {
        const {
          companyEmail,
          companyName,
          websiteUrl,
          // eslint-disable-next-line object-curly-newline
          address: { city, street, country, postalCode },
        } = company || {};
        // validate user input
        const { userErrors, valid } = validateSignUpInput(
          password,
          confirmPassword,
          email,
          firstName,
          lastName,
          phoneNumber,
          companyEmail,
          companyName,
          websiteUrl,
          city,
          street,
          country,
          postalCode,
        );
        // if not valid input
        if (!valid) {
          return {
            __typename: 'UserInputError',
            message: 'Invalid user input',
            userErrors,
            valid,
          };
        }

        // make sure user is unique
        const user = await User.findOne({ email });
        if (user) {
          // make sure phone is unique
          if (user.phoneNumber === phoneNumber) {
            return {
              __typename: 'UserInputError',
              message: 'Phone number already exists',
              userErrors,
              valid,
            };
          }
          // email is not unique
          return {
            __typename: 'UserInputError',
            message: 'Email already exists',
            userErrors,
            valid,
          };
        }

        // hash password : use the static method u added on User schema
        // eslint-disable-next-line no-param-reassign
        password = await User.generatePasswordHash(password);

        const newUser = new User({
          email,
          password,
          createdAt: new Date().toISOString(),
          role,
          company,
          firstName,
          lastName,
          phoneNumber,
        });

        const res = await newUser.save();
        return {
          __typename: 'Token',
          token: await createToken(res, secret, '30m'),
        };
      } catch (err) {
        return {
          __typename: 'SignupError',
          message: 'Unable to sign up user',
          type: `${err}`,
        };
      }
    },

    updateUser: combineResolvers(
      isAuthenitcated,
      async (
        _,
        { id, updateUserInput },
        { models: { User }, secret },
      ) => {
        try {
          const { userErrors, valid } = validateUpdateUserInput(
            updateUserInput,
          );

          if (!valid) {
            return {
              __typename: 'UserInputError',
              message: 'Invalid user input',
              userErrors,
              valid,
            };
          }
          const { company, ...args } = updateUserInput;
          const { address } = company;
          const updatedUser = await User.findByIdAndUpdate(id, args, {
            new: true,
            useFindAndModify: false,
          });
          const addressProperties = Object.entries(address);
          addressProperties.forEach((addressProperty) => {
            const propertyName = addressProperty[0];
            const propertyValue = addressProperty[1];
            updatedUser.company.address[propertyName] = propertyValue;
          });
          const companyProperties = Object.entries(company);
          companyProperties.forEach((companyProperty) => {
            const propertyName = companyProperty[0];
            const propertyValue = companyProperty[1];
            updatedUser.company[propertyName] = propertyValue;
          });
          updatedUser.save();
          return {
            __typename: 'UpdatedUser',
            user: updatedUser,
            token: await createToken(updatedUser, secret, '300m'),
          };
        } catch (err) {
          return {
            __typename: 'UpdateUserError',
            message: 'Unable to update user',
            type: `${err}`,
          };
        }
      },
    ),

    async signIn(
      _,
      { email, password },
      { models: { User }, secret },
    ) {
      try {
        // validate login input
        const { userErrors, valid } = validateLoginInput(
          email,
          password,
        );

        if (!valid) {
          return {
            __typename: 'UserInputError',
            userErrors,
            valid,
            message: 'Invalid Input!',
          };
        }

        // see if user exists
        const user = await User.findOne({ email });
        if (!user) {
          return {
            __typename: 'SignInError',
            message: 'User not found',
            type: 'SignInError',
          };
        }

        // compare password : using static method on User schema
        const match = await User.validatePassword(
          password,
          user.password,
        );

        if (!match) {
          return {
            __typename: 'SignInError',
            message: 'Wrong credentials',
            type: 'SignInError',
          };
        }

        return {
          __typename: 'Token',
          token: await createToken(user, secret, '30m'),
        };
      } catch (err) {
        return {
          __typename: 'SignInError',
          type: `${err}`,
          message: 'Unable to sign in',
        };
      }
    },
  },
};
