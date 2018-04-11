'use strict';

const Joi = require('joi');

const createUserSchema = Joi.object({
  username: Joi.string()
               .alphanum()
               .min(2)
               .max(30)
               .required(),
  email: Joi.string()
            .email()
            .required(),
  password: Joi.string()
               .required(),
  role_id: Joi.string()
                    .min(2)
                    .max(60)
                    .required()
});

module.exports = createUserSchema;
