/* eslint-disable func-names */
const { model, Schema } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  email: String,
  password: String,
  createdAt: String,
  role: String,
  firstName: String,
  lastName: String,
  phoneNumber: String,
  isVerified: Boolean,
  company: {
    websiteUrl: { type: String },
    companyName: { type: String },
    companyEmail: { type: String },
    address: {
      country: { type: String },
      city: { type: String },
      postalCode: { type: String },
    },
  },
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
