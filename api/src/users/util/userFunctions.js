'use strict';

const Boom = require('boom');
const bcrypt = require('bcrypt');
const User = require('../model/User');

function verifyUniqueUser (req, res) {
  // Find an entry from the database that
  // matches either the email or username
  User.findOne({
    $or: [
      { email: req.payload.email },
      { username: req.payload.username }
    ]
  }, (err, user) => {
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
}

function verifyCredentials (req, res) {
  const password = req.payload.password;

  User.findOne({
    $or: [
      { email: req.payload.email },
      { username: req.payload.username }
    ]
  }, (err, user) => {
    if (user) {
      bcrypt.compare(password, user.password, (compareErr, isValid) => {
        if (isValid) {
          return res(user);
        }

        return res(Boom.badRequest('Incorrect password!'));
      });
    }
    else {
      return res(Boom.badRequest('Incorrect username or email!'));
    }
  });
}


module.exports = {
  verifyUniqueUser,
  verifyCredentials
};
