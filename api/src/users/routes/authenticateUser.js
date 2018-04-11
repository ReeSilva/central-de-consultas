'use strict';

const authenticateUserSchema = require('../schemas/authenticateUser');
const verifyCredentials = require('../util/userFunctions').verifyCredentials;
const handler = require('../handlers/handlers').handleLoginPOST;

module.exports = {
  method: 'POST',
  path: '/api/users/login',
  config: {
    // Check the user's password against the DB
    pre: [
      { method: verifyCredentials, assign: 'user' }
    ],
    handler,
    validate: {
      payload: authenticateUserSchema
    }
  }
};
