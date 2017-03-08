'use strict';

const bcrypt = require('bcrypt-as-promised');
const Boom = require('boom');
const User = require('../model/User');
const createToken = require('../util/userFunctions').createToken;
const co = require('co');

const users = {};

const _hashPassword = co.wrap(function* hashPassword (password) {
  // Generate a salt at level 10 strength
  const salt = yield bcrypt.genSalt(10);
  const hash = yield bcrypt.hash(password, salt);
  return hash;
});

users.handlePOST = co.wrap(function* handler (req, res) {
  const user = new User();
  user.email = req.payload.email;
  user.username = req.payload.username;
  user.role_id = req.payload.role_id;
  user.password = yield _hashPassword(req.payload.password);

  const savedUser = yield user.save().catch(error => res(Boom.badImplementation(error)));
  const token = yield createToken(savedUser);
  return res({ token }).code(201);
});

users.handleLoginPOST = co.wrap(function* handler (req, res) {
  // If the user's password is correct, we can issue a token.
  // If it was incorrect, the error will bubble up from the pre method
  const token = yield createToken(req.pre.user);
  res({ token }).code(201);
});

module.exports = users;
