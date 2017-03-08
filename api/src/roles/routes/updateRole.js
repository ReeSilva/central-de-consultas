'use strict';

const handler = require('../handlers/handlers').handlePATCH;
const updateRoleSchema = require('../schemas/updateRole');

module.exports = {
  method: 'PATCH',
  path: '/api/roles/{role_id}',
  config: {
    handler,
    auth: {
      strategy: 'jwt',
      scope: ['admin+roles:update']
    },
    validate: {
      payload: updateRoleSchema
    }
  }
};
