'use strict';

const bcrypt = require('bcrypt');
const Boom = require('boom');
const User = require('../model/User');
const createUserSchema = require('../schemas/createUser');
const verifyUniqueUser = require('../util/userFunctions').verifyUniqueUser;
const createToken = require('../util/token');

function hashPassword (password, cb) {
  // Generate a salt at level 10 strength
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (hashErr, hash) => cb(hashErr, hash));
  });
}

module.exports = {
  method: 'POST',
  path: '/api/users',
  config: {
    // Before the route handler runs, verify that the user is unique
    pre: [
      { method: verifyUniqueUser }
    ],
    handler: (req, res) => {
      const user = new User();
      user.email = req.payload.email;
      user.username = req.payload.username;
      user.allowed_scopes = [
        ['patient+user:rad'],
        ['patient+user:write'],
        ['patient+appointment:read']
      ];
      hashPassword(req.payload.password, (err, hash) => {
        if (err) {
          throw Boom.badRequest(err);
        }
        user.password = hash;
        user.save((saveErr, savedUser) => {
          if (saveErr) {
            throw Boom.badRequest(saveErr);
          }
          // If the user is saved successfully, issue a JWT
          return res({ id_token: createToken(savedUser) }).code(201);
        });
      });
    },
    // Validate the payload against the Joi schema
    validate: {
      payload: createUserSchema
    }
  }
};
