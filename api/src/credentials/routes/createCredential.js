'use strict';

const Boom = require('boom');
const Credential = require('../model/Credential');
const createCredentialSchema = require('../schemas/createCredential');

module.exports = {
  method: 'POST',
  path: '/api/credentials',
  config: {
    handler: (req, res) => {
      const credential = new Credential();
      credential.name = req.payload.name;
      credential.allowed_scopes = req.payload.allowed_scopes;
      credential.save((saveErr, savedCredential) => {
        if (saveErr) {
          return res(Boom.badRequest(saveErr));
        }

        return res({ credential_id: savedCredential._id }).code(201);
      });
    },
    validate: {
      payload: createCredentialSchema
    }
  }
};
