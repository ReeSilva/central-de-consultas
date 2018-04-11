'use strict';

const handler = require('../handlers/handlers').handleGET;

module.exports = {
  method: 'GET',
  path: '/api/roles/{role_id?}',
  config: {
    handler,
    auth: {
      strategy: 'jwt',
      scope: ['admin+roles:read']
    },
  }
};
