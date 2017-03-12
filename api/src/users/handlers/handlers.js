'use strict';

const bcrypt = require('bcrypt-as-promised');
const Boom = require('boom');
const User = require('../model/User');
const createToken = require('../util/userFunctions').createToken;
const co = require('co');
const winston = require('winston');

const users = {};

const _hashPassword = co.wrap(function* hashPassword(password) {
  try {
    // Generate a salt at level 10 strength
    const salt = yield bcrypt.genSalt(10);
    const hash = yield bcrypt.hash(password, salt);
    return hash;
  } catch (e) {
    throw Boom.badImplementation(e);
  }
});

users.handlePOST = co.wrap(function* handler(req, res) {
  try {
    winston.info({
      msg: 'saving a new user',
      username: req.payload.username
    });

    const user = new User();
    user.email = req.payload.email;
    user.username = req.payload.username;
    user.role_id = req.payload.role_id;
    user.password = yield _hashPassword(req.payload.password);

    const savedUser = yield user.save().catch(error => res(Boom.badImplementation(error)));

    winston.info({
      msg: 'new user saved',
      username: savedUser.username
    });

    const token = yield createToken(savedUser);
    return res({ token }).code(201);
  } catch (e) {
    winston.error({
      msg: 'failed to save new user',
      error: e
    });

    return res(Boom.badImplementation(e));
  }
});

users.handleLoginPOST = co.wrap(function* handler(req, res) {
  try {
    // If the user's password is correct, we can issue a token.
    // If it was incorrect, the error will bubble up from the pre method
    winston.info({
      msg: 'generating token to user',
      user: req.pre.user.username
    });

    const token = yield createToken(req.pre.user);

    winston.info({
      msg: 'generated token to user',
      user: req.pre.user.username
    });
    res({ token }).code(201);
  } catch (e) {
    winston.error({
      msg: 'user failed to login',
      error: e
    });

    return res(Boom.badImplementation(e));
  }
});

users.handleGET = co.wrap(function* handler(req, res) {
  try {
    let returnedUsers;
    if (req.params.username) {
      winston.info({
        msg: 'getting an specific user',
        username: req.params.username
      });

      returnedUsers = yield User.findOne({ username: req.params.username })
      .select('-password -__v')
      .catch(error => res(Boom.badImplementation(error)));

      winston.info({
        msg: 'getted an specific user',
        username: req.params.username
      });

      if (!returnedUsers) {
        return res(Boom.notFound());
      }
    } else {
      winston.info({
        msg: 'getting all users'
      });

      returnedUsers = yield User.find()
      .select('-password -__v')
      .catch(error => res(Boom.badRequest(error)));

      winston.info({
        msg: 'getted all users'
      });
    }

    return res(returnedUsers);
  } catch (e) {
    winston.error({
      msg: 'failed to get user',
      error: e
    });

    return res(Boom.badImplementation(e));
  }
});

users.handlePATCH = co.wrap(function* handler(req, res) {
  try {
    winston.info({
      msg: 'editing user',
      username: req.params.username
    });

    if (req.auth.credentials.username !== req.params.username) {
      return res(Boom.forbidden('You can only edit your user'));
    }
    yield User.findOneAndUpdate({ username: req.params.username },
                      { $set: req.payload })
              .catch(error => res(Boom.notFound(error)));

    winston.info({
      msg: 'edited user',
      username: req.params.username
    });

    return res().code(204);
  } catch (error) {
    winston.error({
      msg: 'failed to edit user',
      username: req.params.username,
      error
    });

    return res(Boom.badImplementation(error));
  }
});

users.handleDELETE = co.wrap(function* handler(req, res) {
  try {
    winston.info({
      msg: 'deleting user',
      username: req.params.username
    });

    if (req.auth.credentials.username !== req.params.username) {
      return res(Boom.forbidden('You can only delete your user'));
    }
    yield User.remove({ username: req.params.username }).catch(updateErr => res(Boom.notFound(updateErr)));

    winston.info({
      msg: 'user deleted',
      username: req.params.username
    });

    return res().code(204);
  } catch (e) {
    winston.error({
      msg: 'failed to delete user',
      username: req.params.username,
      error: e
    });

    return res(Boom.badImplementation(e));
  }
});

module.exports = users;
