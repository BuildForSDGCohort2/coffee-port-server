const jwt = require('jsonwebtoken');

const createToken = async (user, secret, expiresIn) => {
  try {
    const { id, email } = user;
    return await jwt.sign({ id, email }, secret, {
      expiresIn,
    });
  } catch (err) {
    console.log('err');
  }
};

module.exports = { createToken };
