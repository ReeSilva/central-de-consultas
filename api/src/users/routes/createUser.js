'use strict';

const handler = require('../handlers/handlers').handlePOST;
const createUserSchema = require('../schemas/createUser');
const verifyUniqueUser = require('../util/userFunctions').verifyUniqueUser;

module.exports = {
  method: 'POST',
  path: '/api/users',
  config: {
    // Before the route handler runs, verify that the user is unique
    pre: [
      { method: verifyUniqueUser }
    ],
    handler,
    // Validate the payload against the Joi schema
    validate: {
      payload: createUserSchema
    }
  }
};
