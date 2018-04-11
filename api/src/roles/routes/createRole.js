'use strict';

const handler = require('../handlers/handlers').handlePOST;
const createRoleSchema = require('../schemas/createRole');

module.exports = {
  method: 'POST',
  path: '/api/roles',
  config: {
    handler,
    auth: {
      strategy: 'jwt',
      scope: ['admin+roles:create']
    },
    validate: {
      payload: createRoleSchema
    }
  }
};
