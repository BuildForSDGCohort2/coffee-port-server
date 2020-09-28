const { combineResolvers } = require('graphql-resolvers');
const {
  validateSignUpInput,
  validateLoginInput,
  validateUpdateUserInput,
} = require('../util/validators');
const { createToken } = require('../util/helpers');
const { isAuthenitcated, isAdmin } = require('./authorization');

module.exports = {
  Query: {
    async users(_, { role }, { models: { User } }) {
      try {
        if (role) {
          const filteredUsers = await User.find({ role });
          return {
            __typename: 'Users',
            users: filteredUsers,
          };
        }

        const users = await User.find();
        return {
          __typename: 'Users',
          users,
        };
      } catch (err) {
        return {
          __typename: 'UsersError',
          type: `${err}`,
          message: 'Unable to retrive users',
        };
      }
    },
    async user(_, { id }, { models: { User } }) {
      try {
        const user = await User.findById(id);
        return {
          __typename: 'User',
          ...user._doc,
          id: user._doc._id,
        };
      } catch (err) {
        return {
          __typename: 'UserDoesNotExist',
          message: 'Error getting user',
          type: `${err}`,
        };
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
          address: { city, country, postalCode },
        } = company;
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
          country,
          postalCode,
          role,
        );
        console.log(userErrors);
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
          isVerified: false,
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

          if (address !== undefined && address != null) {
            const addressProperties = Object.entries(address);
            addressProperties.forEach((addressProperty) => {
              const propertyName = addressProperty[0];
              const propertyValue = addressProperty[1];
              updatedUser.company.address[
                propertyName
              ] = propertyValue;
            });
          }

          const companyProperties = Object.entries(company);
          companyProperties.forEach((companyProperty) => {
            const propertyName = companyProperty[0];
            const propertyValue = companyProperty[1];
            if (propertyName !== 'address') {
              updatedUser.company[propertyName] = propertyValue;
            }
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

    deleteUser: combineResolvers(
      isAdmin,
      async (_, { id }, { models: { User } }) => {
        try {
          await User.deleteOne({ _id: id });
          return {
            __typename: 'DeletedUserMessage',
            message: 'User is successfuly deleted.',
            userId: id,
          };
        } catch (err) {
          return {
            __typename: 'DeleteUserError',
            message: 'Error occured while deleting user.',
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
