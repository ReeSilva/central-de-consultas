'use strict';

const Code = require('code');
const Lab = require('lab');
const Role = require('../../api/src/roles/model/Role');
const mongoose = require('mongoose');
require('dotenv').config({ path: './test/.env.test' });

exports.lab = Lab.script();
const lab = exports.lab;

lab.experiment('when I make a patch request to api/roles/fake_id', () => {
  lab.before((done) => {
    const dbUrl = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
    mongoose.Promise = global.Promise;
    mongoose.connect(dbUrl, {}, (mongoErr) => {
      if (mongoErr) {
        throw mongoErr;
      }

      done();
    });
  });

  lab.after((done) => {
    mongoose.connection.close();
    done();
  });

  lab.beforeEach((done) => {
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

  lab.afterEach((done) => {
    Role.remove({}).then(() => {
      done();
    });
  });

  lab.test('Without authorization header', (done) => {
    let opt = {};

    lab.before((done) => {
      opt = {
        method: 'PATCH'
      };

      done();
    });

    done();
  });

  lab.test('With an invalid JWT token', (done) => {
    done();
  });

  lab.test('With an user with insufficient scope', (done) => {
    done();
  });

  lab.test('With valid credentials', (done) => {
    done();
  });
});
