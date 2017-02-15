'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const credentialModel = new Schema({
  name: {
    type: String,
    required: true,
    index: { unique: true }
  },
  allowed_scopes: {
    type: [],
    required: true
  }
});

module.exports = mongoose.model('Credential', credentialModel);
