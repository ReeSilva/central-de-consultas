// api/users/util/token.js

'use strict';

const jwt = require('jsonwebtoken');
const config = require('config');

function createToken (user) {
  // Sign the JWT
  console.log('>>>> user.allowed_scopes', user.allowed_scopes);
  return jwt.sign({ id: user._id, username: user.username, scope: user.allowed_scopes }, config.get('jwtSecret'), { algorithm: 'HS256', expiresIn: '1h' });
}

module.exports = createToken;
