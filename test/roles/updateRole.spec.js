'use strict';

const Code = require('code');
const Lab = require('lab');
const Role = require('../../api/src/roles/model/Role');
const mongoose = require('mongoose');
const server = require('../../server.js');

require('dotenv').config({ path: './test/.env.test' });

exports.lab = Lab.script();
const lab = exports.lab;
const describe = lab.describe;
const before = lab.before;
const after = lab.after;
const it = lab.it;

describe('when I make a patch request to api/roles/fake_id', () => {
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
      const role = new Role();
      role.name = 'test';
      role.allowed_scopes = [
        ['admin+test:create'],
        ['admin+test:read']
      ];
      role.save().then(() => {
        done();
      });
    });

    after((done) => {
      Role.remove({}).then(() => {
        done();
      });
    });

    before((done) => {
      opt = {
        method: 'PATCH',
        url: '/api/roles/fake_role_id'
      };

      done();
    });

    it('should return a 401 error', (done) => {
      server.inject(opt, (response) => {
        Code.expect(response.statusCode).to.equal(401);
        done();
      });
    });
  });

  describe('With an invalid JWT token', () => {
    it('should return a 403 error', (done) => {
      done();
    });
  });

  describe('With an user with insufficient scope', () => {
    it('should return a 403 error', (done) => {
      done();
    });
  });

  describe('With valid role', () => {
    it('should return a list of roles', (done) => {
      done();
    });
  });
});
