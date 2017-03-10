'use strict';

const handler = require('../handlers/handlers').handleGET;

module.exports = {
  method: 'GET',
  path: '/api/users/{username?}',
  config: {
    handler,
    auth: {
      strategy: 'jwt',
      scope: ['admin+users:read', 'patient+users:read', 'doctor+users:read']
    }
  }
};
