const bcrypt = require('bcrypt');
const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  email: String,
});

module.exports = model('User', userSchema);
