const jwt = require('jsonwebtoken');

const createToken = async (user, secret, expiresIn) => {
  try {
    const { id, email, role, company, phoneNumber } = user;
    return await jwt.sign(
      { id, email, role, company, phoneNumber },
      secret,
      {
        expiresIn,
      },
    );
  } catch (err) {
    console.log('err');
  }
};

module.exports = { createToken };
