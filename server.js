'use strict';

const Hapi = require('hapi');
const mongoose = require('mongoose');
const glob = require('glob');
const path = require('path');
const config = require('config');

const server = new Hapi.Server();
server.connection({
  host: '0.0.0.0',
  port: process.env.PORT || 3000,
});

mongoose.Promise = global.Promise;

const dbUrl = `mongodb://${config.get('dbConfig.host')}:${config.get('dbConfig.port')}/${config.get('dbConfig.dbName')}`;

server.register(require('hapi-auth-jwt'), (err) => {
  if (err) throw err;

  server.auth.strategy('jwt', 'jwt', {
    key: config.get('jwtSecret'),
    verifyOptions: { algorithms: ['HS256'] }
  });

  // Look through the routes in
  // all the subdirectories of API
  // and create a new route for each
  glob.sync('api/src/**/routes/*.js', {
    root: __dirname
  }).forEach((file) => {
    const route = require(path.join(__dirname, file));
    server.route(route);
  });
});

server.start((err) => {
  if (err) {
    throw err;
  }

  mongoose.connect(dbUrl, {}, (mongoErr) => {
    if (mongoErr) {
      throw mongoErr;
    }
  });
});
