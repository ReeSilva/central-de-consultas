'use strict';

const Boom = require('boom');
const Role = require('../model/Role');
const co = require('co');

const roles = {};

roles.handlePOST = co.wrap(function* handler(req, res) {
  try {
    const role = new Role();
    role.name = req.payload.name;
    role.allowed_scopes = req.payload.allowed_scopes;
    const savedRole = yield role.save().catch(error => res(Boom.badRequest(error)));

    return res({ savedRole }).code(201);
  } catch (error) {
    return res(Boom.badImplementation(error));
  }
});

roles.handlePATCH = co.wrap(function* handler(req, res) {
  try {
    yield Role.findOneAndUpdate({ _id: req.params.role_id },
                      { $set: { allowed_scopes: req.payload.allowed_scopes } })
              .catch(error => res(Boom.notFound(error)));

    return res().code(204);
  } catch (error) {
    return res(Boom.badImplementation(error));
  }
});

roles.handleDELETE = co.wrap(function* handler(req, res) {
  try {
    yield Role.remove({ _id: req.params.role_id }).catch(updateErr => res(Boom.notFound(updateErr)));

    return res().code(204);
  } catch (error) {
    return res(Boom.badImplementation(error));
  }
});

roles.handleGET = co.wrap(function* handler(req, res) {
  try {
    let returnedRoles;
    if (req.params.role_id) {
      returnedRoles = yield Role.findOne({
        _id: req.params.role_id
      }).catch(error => res(Boom.notFound(error)));
    } else {
      returnedRoles = yield Role.find().catch(error => res(Boom.badRequest(error)));
    }

    return res(returnedRoles);
  } catch (error) {
    return res(Boom.badImplementation(error));
  }
});

module.exports = roles;
