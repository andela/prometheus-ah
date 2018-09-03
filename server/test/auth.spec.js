import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import userFaker from './helpers/userFakeData';

chai.use(chaiHttp);

describe('Tests', () => {
  it('it should pass the test', (done) => {
    expect('true').to.equal('true');
    done();
  });
});

describe('User SignUp', () => {
  describe('When passed valid data', () => {
    it('it should create a new User and respond with jwt ', (done) => {
      chai.request(app)
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send({
          user: userFaker.validUserDetails
        })
        .end((err, res) => {
          const newUser = res.body.user;
          expect(res.status).to.equal(201);
          expect(res.type).to.equal('application/json');
          expect(newUser.username).to.equal('ugochukwu15');
          expect(newUser.email).to.equal('valentine.ezeh@yahoo.com');
          if (err) return done(err);
          done();
        });
    });
    it('it should not create a new user with existing email ', (done) => {
      chai.request(app)
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send({
          user: userFaker.validUserDetails
        })
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.body.message).to.equal('Email or Username is already in use by another User.');
          if (err) return done(err);
          done();
        });
    });
  });
  describe('When passed invalid data', () => {
    it('It should throw an error if password and confirm password does not match.', (done) => {
      chai.request(app)
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send({
          user: userFaker.userDetailsWithPasswordMismatch
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors.password[0]).to.equal('Password Mismatch.');
          if (err) return done(err);
          done();
        });
    });
  });
});

describe('User Login', () => {
  describe('When passed valid data/credentials', () => {
    it('It should authenticate a user and respond with jwt', (done) => {
      const { username, password } = userFaker.validUserDetails;
      chai.request(app)
        .post('/api/users/login')
        .set('Content-Type', 'application/json')
        .send({
          user: { username, password }
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Welcome User you are now logged in.');
          if (err) return done(err);
          done();
        });
    });
  });

  describe('When passed invalid data/credentials', () => {
    it('It should not authenticate a user if invalid credentials sent.', (done) => {
      const { username, password } = userFaker.userDetailsWithPasswordMismatch;
      chai.request(app)
        .post('/api/users/login')
        .set('Content-Type', 'application/json')
        .send({
          user: { username, password }
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('Username or password does not match.');
          if (err) return done(err);
          done();
        });
    });
    describe('When User send Username that does not exist in the database', () => {
      it('it should return a message "User does not exist." if user not found', (done) => {
        const { username, password } = userFaker.userDetailsDoesNotExist;
        chai.request(app)
          .post('/api/users/login')
          .set('Content-Type', 'application/json')
          .send({
            user: { username, password }
          })
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(res.body.message).to.equal('Username or password does not match.');
            if (err) return done(err);
            done();
          });
      });
    });
  });
});
