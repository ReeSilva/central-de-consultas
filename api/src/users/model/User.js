'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userModel = new Schema({
  email: {
    type: String,
    required: true,
    index: { unique: true }
  },
  username: {
    type: String,
    required: true,
    index: { unique: true }
  },
  password: {
    type: String,
    required: true
  },
  role_id: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

module.exports = mongoose.model('User', userModel);
