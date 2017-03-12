'use strict';

const Boom = require('boom');
const Role = require('../model/Role');
const co = require('co');
const winston = require('winston');

const roles = {};

roles.handlePOST = co.wrap(function* handler(req, res) {
  try {
    const role = new Role();
    role.name = req.payload.name;
    role.allowed_scopes = req.payload.allowed_scopes;

    winston.info({
      msg: 'Saving role',
      name: req.payload.name,
    });

    const savedRole = yield role.save().catch(error => res(Boom.badRequest(error)));

    winston.info({
      msg: 'Saved role',
      name: savedRole.name,
    });

    return res({ savedRole }).code(201);
  } catch (error) {
    winston.error({
      msg: 'failed to save role',
      error
    });

    return res(Boom.badImplementation(error));
  }
});

roles.handlePATCH = co.wrap(function* handler(req, res) {
  try {
    winston.info({
      msg: 'Editing role',
      id: req.params.role_id
    });

    yield Role.findOneAndUpdate({ _id: req.params.role_id },
                      { $set: { allowed_scopes: req.payload.allowed_scopes } })
              .catch(error => res(Boom.notFound(error)));

    winston.info({
      msg: 'Role edited',
      id: req.params.role_id
    });

    return res().code(204);
  } catch (error) {
    winston.error({
      msg: 'failed to edit role',
      id: req.params.role_id,
      error
    });

    return res(Boom.badImplementation(error));
  }
});

roles.handleDELETE = co.wrap(function* handler(req, res) {
  try {
    winston.info({
      msg: 'deleting role',
      id: req.params.role_id
    });

    yield Role.remove({ _id: req.params.role_id }).catch(updateErr => res(Boom.notFound(updateErr)));

    winston.info({
      msg: 'role deleted',
      id: req.params.role_id
    });

    return res().code(204);
  } catch (error) {
    winston.error({
      msg: 'failed to delete role',
      id: req.params.role_id,
      error
    });

    return res(Boom.badImplementation(error));
  }
});

roles.handleGET = co.wrap(function* handler(req, res) {
  try {
    let returnedRoles;

    if (req.params.role_id) {
      winston.info({
        msg: 'getting an specific role',
        id: req.params.role_id
      });

      returnedRoles = yield Role.findOne({
        _id: req.params.role_id
      }).catch(error => res(Boom.notFound(error)));
    } else {
      winston.info({
        msg: 'getting all roles'
      });

      returnedRoles = yield Role.find().catch(error => res(Boom.badRequest(error)));
    }

    return res(returnedRoles);
  } catch (error) {
    winston.error({
      msg: 'failed to get roles',
      error
    });

    return res(Boom.badImplementation(error));
  }
});

module.exports = roles;
