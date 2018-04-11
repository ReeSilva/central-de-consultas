'use strict';

const handler = require('../handlers/handlers').handlePATCH;
const updateUserSchema = require('../schemas/updateUser');

module.exports = {
  method: 'PATCH',
  path: '/api/users/{username}',
  config: {
    handler,
    auth: {
      strategy: 'jwt',
      scope: ['admin+users:update']
    },
    // Validate the payload against the Joi schema
    validate: {
      payload: updateUserSchema
    }
  }
};
