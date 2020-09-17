const jwt = require('jsonwebtoken');

const createToken = async (user, secret, expiresIn) => {
  try {
    const {
      id,
      email,
      role,
      company,
      phoneNumber,
      firstName,
      lastName,
      createdAt,
    } = user;
    return await jwt.sign(
      {
        id,
        email,
        role,
        company,
        phoneNumber,
        firstName,
        lastName,
        createdAt,
      },
      secret,
      {
        expiresIn,
      },
    );
  } catch (err) {
    return {
      __typename: 'TokenError',
      message: 'Failed to create token',
    };
  }
};

module.exports = { createToken };
