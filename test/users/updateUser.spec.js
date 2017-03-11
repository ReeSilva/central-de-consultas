'use strict';

const Code = require('code');
const Lab = require('lab');
const mongoose = require('mongoose');
const User = require('../../api/src/users/model/User');
const server = require('../../server.js');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: './test/.env.test' });

exports.lab = Lab.script();
const lab = exports.lab;
const describe = lab.describe;
const before = lab.before;
const after = lab.after;
const it = lab.it;

describe('when I make a PATCH request to api/users/fake_id', () => {
  before((done) => {
    const dbUrl = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
    mongoose.Promise = global.Promise;
    mongoose.connect(dbUrl)
    .then(
      () => { done(); },
      (err) => { throw err; }
    );
  });

  after((done) => {
    mongoose.connection.close();
    done();
  });

  describe('Without authorization header', () => {
    let opt = {};

    before((done) => {
      opt = {
        method: 'PATCH',
        url: '/api/users/fake_user_id'
      };

      done();
    });

    it('should return a missing authentication message', (done) => {
      server.inject(opt, (response) => {
        Code.expect(response.result.message).to.equal('Missing authentication');
        done();
      });
    });
  });

  describe('With an invalid JWT token', () => {
    let opt = {};

    before((done) => {
      opt = {
        method: 'PATCH',
        headers: {
          Authorization: 'Bearer fAkE.jWt.ToKeN'
        },
        url: '/api/users/fake_user_id'
      };
      done();
    });

    it('should return a invalid signature message error', (done) => {
      server.inject(opt, (response) => {
        Code.expect(response.result.message).to.equal('Invalid signature received for JSON Web Token validation');
        done();
      });
    });
  });

  describe('With an user with insufficient scope', () => {
    let jwtToken;
    let opt;

    before((done) => {
      jwtToken = jwt.sign(
        {
          id: 'fakeUserId',
          username: 'fakeUsername',
          scope: [
            ['admin+blabla']
          ]
        },
        process.env.JWT_SECRET,
        { algorithm: 'HS256', expiresIn: '1h' }
      );
      done();
    });

    before((done) => {
      opt = {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${jwtToken}`
        },
        url: '/api/users/fake_user_id'
      };
      done();
    });

    it('should return a 403 error', (done) => {
      server.inject(opt, (response) => {
        Code.expect(response.statusCode).to.equal(403);
        done();
      });
    });
  });

  describe('With invalid payload', () => {
    let jwtToken;
    let opt;
    let username;

    before((done) => {
      const user = new User();
      user.username = 'test';
      user.email = 'test@test.com';
      user.password = '$2a$10$Tf1vNI9B.xSZgreRlSfHt.y4toayxZVn82we9JC.O59EGwF.lTiYe';
      user.role_id = 'fake_role_id';

      user.save().then((savedUser) => {
        username = savedUser.username;
        done();
      });
    });

    before((done) => {
      jwtToken = jwt.sign(
        {
          id: 'fakeUserId',
          username,
          scope: [
            ['admin+users:update']
          ]
        },
        process.env.JWT_SECRET,
        { algorithm: 'HS256', expiresIn: '1h' }
      );
      done();
    });

    before((done) => {
      opt = {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${jwtToken}`
        },
        url: `/api/users/${username}`,
        payload: {
          email: 123456
        }
      };
      done();
    });

    after((done) => {
      User.remove({}).then(() => {
        done();
      });
    });

    it('should return a 400', (done) => {
      server.inject(opt, (response) => {
        Code.expect(response.statusCode).to.equal(400);
        done();
      });
    });
  });

  describe('With valid infos', () => {
    let jwtToken;
    let opt;
    let username;

    before((done) => {
      const user = new User();
      user.username = 'test';
      user.email = 'test@test.com';
      user.password = '$2a$10$Tf1vNI9B.xSZgreRlSfHt.y4toayxZVn82we9JC.O59EGwF.lTiYe';
      user.role_id = 'fake_role_id';

      user.save().then((savedUser) => {
        username = savedUser.username;
        done();
      });
    });

    before((done) => {
      jwtToken = jwt.sign(
        {
          id: 'fakeUserId',
          username,
          scope: [
            ['admin+users:update']
          ]
        },
        process.env.JWT_SECRET,
        { algorithm: 'HS256', expiresIn: '1h' }
      );
      done();
    });

    before((done) => {
      opt = {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${jwtToken}`
        },
        url: `/api/users/${username}`,
        payload: {
          email: 'test@test2.com'
        }
      };
      done();
    });

    after((done) => {
      User.remove({}).then(() => {
        done();
      });
    });

    it('should return a 204', (done) => {
      server.inject(opt, (response) => {
        Code.expect(response.statusCode).to.equal(204);
        done();
      });
    });
  });
});
