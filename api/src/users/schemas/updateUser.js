'use strict';

const Joi = require('joi');

const updateUserSchema = Joi.object({
  username: Joi.string()
               .alphanum()
               .min(2)
               .max(30),
  email: Joi.string()
            .email(),
  password: Joi.string(),
  role_id: Joi.string()
                    .min(2)
                    .max(60)
});

module.exports = updateUserSchema;
