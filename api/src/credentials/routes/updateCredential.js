'use strict';

const Boom = require('boom');
const Credential = require('../model/Credential');
const updateCredentialSchema = require('../schemas/updateCredential');

module.exports = {
  method: 'PATCH',
  path: '/api/credentials',
  config: {
    handler: (req, res) => {
      Credential.update({ _id: req.payload.id }, { $set: { allowed_scopes: req.payload.allowed_scopes } }, (updateErr) => {
        if (updateErr) {
          return res(Boom.badRequest(updateErr));
        }

        return res().code(204);
      });
    },
    validate: {
      payload: updateCredentialSchema
    }
  }
};
