'use strict';

const Joi = require('joi');

const updateRoleSchema = Joi.object({
  allowed_scopes: Joi.array().items(Joi.array().items(Joi.string()).min(1).max(1)).min(1).required()
});

module.exports = updateRoleSchema;
