const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

const generatePasswordHash = async function (password) {
  try {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  } catch (err) {
    console.log('err');
  }
};

module.exports = { generatePasswordHash, createToken };
