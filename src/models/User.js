const { model, Schema } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  email: String,
  password: String,
  createdAt: String,
});

userSchema.statics.generatePasswordHash = function (password) {
  const saltRound = 10;
  return bcrypt.hash(password, saltRound);
};

userSchema.statics.validatePassword = function (
  userInputPassword,
  password,
) {
  return bcrypt.compare(userInputPassword, password);
};

module.exports = model('User', userSchema);
