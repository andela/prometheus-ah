import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import users from '../database/seed-data/users';

chai.use(chaiHttp);

let userToken;
let userToken2;
describe('Users profile and password update', () => {
  before((done) => {
    chai.request(app)
      .post('/api/users/login')
      .set('Accept', 'application/json')
      .send({
        user: {
          username: users[1].username,
          password: users[2].password2
        }

      })
      .end((err, res) => {
        userToken = res.body.user.token;
        if (err) return done(err);
        done();
      });
  });
  before((done) => {
    chai.request(app)
      .post('/api/users')
      .set('Accept', 'application/json')
      .send({
        user: {
          username: 'changepass',
          password: 'newpassword',
          password_confirmation: 'newpassword',
          email: 'password@password.com'
        }

      })
      .end((err, res) => {
        userToken2 = res.body.user.token;
        if (err) return done(err);
        done();
      });
  });
  describe('When User is not authenticated', () => {
    it('should return authentication error', (done) => {
      chai.request(app)
        .get('/api/profiles')
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('You need to signup or login to perform this action');
          expect(res.body).not.to.have.property('users');
          if (err) return done(err);
          done();
        });
    });
  });
  describe('When User passed invalid query parameters', () => {
    it('should return authentication error when order query is invalid', (done) => {
      chai.request(app)
        .get('/api/profiles?order=a')
        .set('Content-Type', 'application/json')
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('users');
          if (err) return done(err);
          done();
        });
    });
  });
  describe('When user passed valid query parameter', () => {
    it('should return array of users for valid query parameters', (done) => {
      chai.request(app)
        .get('/api/profiles?limit=1&page=1&order=DESC')
        .set('Content-Type', 'application/json')
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Users profile successfully retrieved');
          expect(res.body).to.have.property('users');
          expect(res.body.users).to.be.an('array');
          expect(res.body).to.have.property('paginationMeta');
          expect(res.body.paginationMeta.currentPage).to.equal(1);
          expect(res.body.paginationMeta.pageSize).to.equal(1);
          if (err) return done(err);
          done();
        });
    });
  });
  describe('When User is not authenticated', () => {
    it('should return authentication error', (done) => {
      const oldPassword = 'newpassword';
      const password = 'password';
      const password_confirmation = 'password'; // eslint-disable-line
      chai.request(app)
        .put('/api/users/password')
        .set('Content-Type', 'application/json')
        .send({
          oldPassword,
          password,
          password_confirmation
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('You need to signup or login to perform this action');
          expect(res.body).not.to.have.property('user');
          if (err) return done(err);
          done();
        });
    });
    it('It should throw an error if password and confirm password does not match.', (done) => {
      const oldPassword = 'newpassword';
      const password = 'password';
      const password_confirmation = '1234578'; // eslint-disable-line
      chai.request(app)
        .put('/api/users/password')
        .set('Content-Type', 'application/json')
        .set('authorization', userToken2)
        .send({
          oldPassword, password, password_confirmation
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors.password[0]).to.equal('Password Mismatch.');
          expect(res.body).not.to.have.property('user');
          if (err) return done(err);
          done();
        });
    });
    it('It should throw an error if password is not up to 8 character', (done) => {
      const oldPassword = 'newpassword';
      const password = 'pass';
      const password_confirmation = 'pass'; // eslint-disable-line
      chai.request(app)
        .put('/api/users/password')
        .set('Content-Type', 'application/json')
        .set('authorization', userToken2)
        .send({
          oldPassword, password, password_confirmation
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors.password[0])
            .to.equal('The password is too short. Min length is 8 characters.');
          expect(res.body).not.to.have.property('user');
          if (err) return done(err);
          done();
        });
    });
    it('It should throw an error if password fields are empty', (done) => {
      const oldPassword = '   ';
      const password = '   ';
      const password_confirmation = '  '; // eslint-disable-line
      chai.request(app)
        .put('/api/users/password')
        .set('Content-Type', 'application/json')
        .set('authorization', userToken2)
        .send({
          oldPassword, password, password_confirmation
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors.password[0])
            .to.equal('password field is required.');
          expect(res.body.errors.oldPassword[0])
            .to.equal('The oldPassword field is required.');
          expect(res.body.errors.password_confirmation[0])
            .to.equal('The password confirmation field is required.');
          expect(res.body).not.to.have.property('user');
          if (err) return done(err);
          done();
        });
    });
    it('It should throw an error if the oldPassword is wrong', (done) => {
      const oldPassword = 'password';
      const password = 'newpassword';
      const password_confirmation = 'newpassword'; // eslint-disable-line
      chai.request(app)
        .put('/api/users/password')
        .set('Content-Type', 'application/json')
        .set('authorization', userToken2)
        .send({
          oldPassword, password, password_confirmation
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message)
            .to.equal('password incorrect, try again');
          expect(res.body).not.to.have.property('user');
          if (err) return done(err);
          done();
        });
    });
    it('It should throw an error if the oldPassword and new password are the same', (done) => {
      const oldPassword = 'newpassword';
      const password = 'newpassword';
      const password_confirmation = 'newpassword'; // eslint-disable-line
      chai.request(app)
        .put('/api/users/password')
        .set('Content-Type', 'application/json')
        .set('authorization', userToken2)
        .send({
          oldPassword, password, password_confirmation
        })
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.body.message)
            .to.equal('New password is the same as previous password');
          expect(res.body).not.to.have.property('user');
          if (err) return done(err);
          done();
        });
    });
    it('It should change users password when all fields are supplied correctly', (done) => {
      const oldPassword = 'newpassword';
      const password = 'password1234';
      const password_confirmation = 'password1234'; // eslint-disable-line
      chai.request(app)
        .put('/api/users/password')
        .set('Content-Type', 'application/json')
        .set('authorization', userToken2)
        .send({
          oldPassword, password, password_confirmation
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message)
            .to.equal('Password successfully updated, you can now login with your new password');
          expect(res.body).to.have.property('user');
          expect(res.body.user).to.be.an('object');
          if (err) return done(err);
          done();
        });
    });
  });
});
