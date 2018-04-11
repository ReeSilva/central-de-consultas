'use strict';

const Joi = require('joi');

const createRoleSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  allowed_scopes: Joi.array().items(Joi.array().items(Joi.string()).min(1).max(1)).min(1).required()
});

module.exports = createRoleSchema;
