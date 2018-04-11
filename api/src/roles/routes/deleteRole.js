'use strict';

const handler = require('../handlers/handlers').handleDELETE;

module.exports = {
  method: 'DELETE',
  path: '/api/roles/{role_id}',
  config: {
    handler,
    auth: {
      strategy: 'jwt',
      scope: ['admin+roles:delete']
    },
  }
};
