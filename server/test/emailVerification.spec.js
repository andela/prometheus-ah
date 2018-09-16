import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../..';
import users from '../database/seed-data/users';
import db from '../database/models';

chai.use(chaiHttp);

let hash1;
let hash2;


const { User } = db;

describe('User SignUp', () => {
  before((done) => {
    chai.request(app)
      .post('/api/users')
      .send({
        user: users[5]
      })
      .end((err) => {
        if (err) return done(err);
        User.findOne({
          where: {
            email: users[5].email
          }
        }).then((user) => {
          hash1 = user.dataValues.hash;
          done();
        }).catch(err => done(err));
      });
  });

  before((done) => {
    chai.request(app)
      .post('/api/users')
      .send({
        user: users[6],
      })
      .end((err, res) => {
        if (err) return done(err);
        hash2 = res.body.user.hash;
        done();
      });
  });

  describe('When passed valid data', () => {
    it('Should confirm a user email address', (done) => {
      chai.request(app)
        .get(`/api/confirmation/${hash1}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Your account was successfully activated.');
          done();
        });
    });

    it('Should return an error if user link has expired', (done) => {
      const func = () => {
        chai.request(app)
          .get(`/api/confirmation/${hash2}`)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('The verification link has expired.');
          });
      };
      setTimeout(func, 1000000);
      done();
    });
    it('Should return an error if user has already been verified', (done) => {
      chai.request(app)
        .get(`/api/confirmation/${hash1}`)
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Your account has already been activated.');
          done();
        });
    });
    it('Should return an error message if user email is not found.', (done) => {
      chai.request(app)
        .post('/api/users/reverify')
        .send({
          user: {
            email: 'wrongemail@gmail.com'
          }
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('The email entered is not registered');
          done();
        });
    });
    it('Should return an error message if user email is not a valid email.', (done) => {
      chai.request(app)
        .post('/api/users/reverify')
        .send({
          user: {
            email: 'joetega.com'
          }
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(400);
          expect(res.body.errors.email[0]).to.equal('Please enter a valid email address.');
          done();
        });
    });
    it('Should return an error message if email field is empty', (done) => {
      chai.request(app)
        .post('/api/users/reverify')
        .send({
          user: {
            email: ''
          }
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(400);
          expect(res.body.errors.email[0]).to.equal('This email field is required.');
          done();
        });
    });
    it('Should send a re-verification email to User.', (done) => {
      chai.request(app)
        .post('/api/users/reverify')
        .send({
          user: {
            email: users[6].email
          }
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('A verification email has been sent to you.');
          done();
        });
    });
    it('Should send an error to the user if user have already been verified.', (done) => {
      chai.request(app)
        .post('/api/users/reverify')
        .send({
          user: {
            email: users[0].email
          }
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(409);
          expect(res.body.message).to.equal('This email has already been verified.');
          done();
        });
    });
    it('It should send a reset password link to the user\'s email.', (done) => {
      chai.request(app)
        .post('/api/users/reset-password')
        .set('Content-Type', 'application/json')
        .send({
          user: {
            email: users[0].email,
          }
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal(`A reset password link has been sent to your ${users[0].email}`);
          if (err) return done(err);
          done();
        });
    });
    it('It should send an error message to the user if user email is not found.', (done) => {
      chai.request(app)
        .post('/api/users/reset-password/')
        .set('Content-Type', 'application/json')
        .send({
          user: {
            email: 'bukkydada@gmail.com',
          }
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Invalid credentials');
          if (err) return done(err);
          done();
        });
    });
    it('It should send a message to the user if password link has already been sent.', (done) => {
      const passwordTimeCheck = () => {
        chai.request(app)
          .post('/api/users/reset-password/')
          .set('Content-Type', 'application/json')
          .send({
            user: {
              email: users[0].email,
            }
          })
          .end((err, res) => {
            expect(res.status).to.equal(409);
            expect(res.body.message).to.equal(`A reset password link has been sent to ${users[0].email} already.`);
            if (err) return done(err);
          });
      };
      setTimeout(passwordTimeCheck, 1500);
      done();
    });
  });
});
