const { model, Schema } = require('mongoose');

const reportSchema = new Schema({
  reportMessage: String,
  reportedUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reporterUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  code: String,
  success: Boolean,
  message: String,
});

module.exports = model('Report', reportSchema);
