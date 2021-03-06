'use strict';

const Code = require('code');
const Lab = require('lab');
const mongoose = require('mongoose');
const Role = require('../../api/src/roles/model/Role');
const server = require('../../server.js');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: './test/.env.test' });

exports.lab = Lab.script();
const lab = exports.lab;
const describe = lab.describe;
const before = lab.before;
const after = lab.after;
const it = lab.it;

describe('when I make a GET request to api/roles', () => {
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
        method: 'GET',
        url: '/api/roles'
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
        method: 'GET',
        headers: {
          Authorization: 'Bearer fAkE.jWt.ToKeN'
        },
        url: '/api/roles'
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
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`
        },
        url: '/api/roles'
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

  describe('With valid role and an specific role', () => {
    let jwtToken;
    let opt;
    let roleId;

    before((done) => {
      jwtToken = jwt.sign(
        {
          id: 'fakeUserId',
          username: 'fakeUsername',
          scope: [
            ['admin+roles:read']
          ]
        },
        process.env.JWT_SECRET,
        { algorithm: 'HS256', expiresIn: '1h' }
      );
      done();
    });

    before((done) => {
      const role = new Role();

      role.name = 'test';
      role.allowed_scopes = [
        ['test'],
        ['test2']
      ];

      role.save().then((savedRole) => {
        roleId = savedRole._id;
        done();
      });
    });

    before((done) => {
      opt = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`
        },
        url: `/api/roles/${roleId}`
      };
      done();
    });

    after((done) => {
      Role.remove({}).then(() => {
        done();
      });
    });

    it('should return a 200', (done) => {
      server.inject(opt, (response) => {
        Code.expect(response.statusCode).to.equal(200);
        done();
      });
    });
  });

  describe('With valid role', () => {
    let jwtToken;
    let opt;

    before((done) => {
      jwtToken = jwt.sign(
        {
          id: 'fakeUserId',
          username: 'fakeUsername',
          scope: [
            ['admin+roles:read']
          ]
        },
        process.env.JWT_SECRET,
        { algorithm: 'HS256', expiresIn: '1h' }
      );
      done();
    });

    before((done) => {
      const docs = [
        {
          name: 'test1',
          allowed_scopes: [
            ['test1'],
            ['test2']
          ]
        },
        {
          name: 'test2',
          allowed_scopes: [
            ['test1'],
            ['test2']
          ]
        }
      ];

      Role.collection.insert(docs)
      .then(() => {
        done();
      });
    });

    before((done) => {
      opt = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`
        },
        url: '/api/roles'
      };
      done();
    });

    after((done) => {
      Role.remove({}).then(() => {
        done();
      });
    });

    it('should return 2 items', (done) => {
      server.inject(opt, (response) => {
        Code.expect(response.result.length).to.equal(2);
        done();
      });
    });
  });
});
