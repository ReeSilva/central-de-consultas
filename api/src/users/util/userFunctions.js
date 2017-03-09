'use strict';

const Boom = require('boom');
const bcrypt = require('bcrypt-as-promised');
const User = require('../model/User');
const Role = require('../../roles/model/Role');
const jwt = require('jsonwebtoken');
const co = require('co');

const verifyUniqueUser = co.wrap(function* verifyUniqueUser(req, res) {
  // Find an entry from the database that
  // matches either the email or username
  const user = yield User.findOne({
    $or: [
      { email: req.payload.email },
      { username: req.payload.username }
    ]
  });

  // Check whether the username or email
  // is already taken and error out if so
  if (user) {
    if (user.username === req.payload.username) {
      return res(Boom.badRequest('Username taken'));
    }
    if (user.email === req.payload.email) {
      return res(Boom.badRequest('Email taken'));
    }
  }

  // If everything checks out, send the payload through
  // to the route handler
  return res(req.payload);
});

const verifyCredentials = co.wrap(function* verifyCredentials(req, res) {
  const password = req.payload.password;

  const user = yield User.findOne({
    $or: [
      { email: req.payload.email },
      { username: req.payload.username }
    ]
  });

  if (user) {
    bcrypt.compare(password, user.password)
          .then(() => res(user))
          .catch(() => res(Boom.badRequest('Invalid credentials')));
  } else {
    return res(Boom.badRequest('Invalid credentials'));
  }
});

const createToken = co.wrap(function* createToken(user) {
  const token = yield Role.findOne({
    _id: user.role_id
  }).then(returnedRole =>
    // Sign the JWT
     jwt.sign(
       {
         id: user._id,
         username: user.username,
         scope: returnedRole.allowed_scopes
       },
       process.env.JWT_SECRET,
       { algorithm: 'HS256', expiresIn: '1h' }
     ));

  return token;
});

module.exports = {
  verifyUniqueUser,
  verifyCredentials,
  createToken
};
