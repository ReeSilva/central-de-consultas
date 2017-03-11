'use strict';

const handler = require('../handlers/handlers').handleDELETE;

module.exports = {
  method: 'DELETE',
  path: '/api/users/{username}',
  config: {
    handler,
    auth: {
      strategy: 'jwt',
      scope: ['admin+users:delete', 'patient+users:delete', 'doctor+users:delete']
    },
  }
};
