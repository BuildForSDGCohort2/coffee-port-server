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

module.exports = model('User', userSchema);
