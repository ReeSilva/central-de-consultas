'use strict';

const User = require('../model/User');
const Boom = require('boom');

module.exports = {
  method: 'GET',
  path: '/api/users/{username}',
  config: {
    handler: (req, res) => {
      User
        .findOne({
          username: req.params.username
        })
        .select('-password -__v')
        .exec((err, user) => {
          if (err) {
            throw Boom.badRequest(err);
          }
          if (!user) {
            throw Boom.notFound('User not found!');
          }
          return res(user);
        });
    },
    auth: {
      strategy: 'jwt',
      scope: ['patient+user:read']
    }
  }
};
