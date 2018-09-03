import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import userFaker from './helpers/userFakeData';
import users from '../utils/users';

chai.use(chaiHttp);

let token1;
let token2;

describe('Profile', () => {
  before((done) => {
    chai.request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send({
        user: {
          username: users[0].username,
          password: users[2].password1
        }
      })
      .end((err, res) => {
        token1 = res.body.user.token;
        if (err) return done(err);
        done();
      });
  });

  before((done) => {
    chai.request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send({
        user: {
          username: users[1].username,
          password: users[2].password2
        }
      })
      .end((err, res) => {
        token2 = res.body.user.token;
        if (err) return done(err);
        done();
      });
  });

  describe('Get User Profile', () => {
    it('should return a user profile if a valid username is provided', (done) => {
      const { username } = userFaker.validUserDetails;
      chai
        .request(app)
        .get(`/api/profiles/${username}`)
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.profile).to.be.an('object');
          if (err) return done(err);
          done();
        });
    });

    it('should return an error message when an invalid username is sent', (done) => {
      const username = 'fakeusername';
      chai
        .request(app)
        .get(`/api/profiles/${username}`)
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal(
            'Sorry, there is no user with that username'
          );
          if (err) return done(err);
          done();
        });
    });
  });

  describe('Edit User Profile', () => {
    it('should edit a profile if the right username and token is sent', (done) => {
      const { username } = users[0];
      const update = {
        user: { bio: 'tomorrow is a better day' }
      };
      chai
        .request(app)
        .put(`/api/profiles/${username}`)
        .set('Content-Type', 'application/json')
        .set('authorization', token1)
        .send(update)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.profile.bio).to.equal('tomorrow is a better day');
          if (err) return done(err);
          done();
        });
    });

    it('should not edit a profile if the validation of input fails', (done) => {
      const { username } = users[0];
      const update = {
        user: { bio: 'tom' }
      };
      chai
        .request(app)
        .put(`/api/profiles/${username}`)
        .set('Content-Type', 'application/json')
        .set('authorization', token1)
        .send(update)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          if (err) return done(err);
          done();
        });
    });

    it('should not edit a profile if the wrong username and token is sent', (done) => {
      const { username } = users[0];
      const update = {
        user: { bio: 'tomorrow is a better day' }
      };
      chai
        .request(app)
        .put(`/api/profiles/${username}`)
        .set('Content-Type', 'application/json')
        .set('authorization', token2)
        .send(update)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.message).to.equal('Access denied.');
          if (err) return done(err);
          done();
        });
    });

    it('should return a message when no token is sent', (done) => {
      const { username } = users[0];
      const update = {
        user: { bio: 'tomorrow is a better day' }
      };
      chai
        .request(app)
        .put(`/api/profiles/${username}`)
        .set('Content-Type', 'application/json')
        .send(update)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('You need to signup or login to perform this action');
          if (err) return done(err);
          done();
        });
    });

    it('should return an error message when a bad token is sent', (done) => {
      const { username } = users[0];
      const update = {
        user: { bio: 'tomorrow is a better day' }
      };
      chai
        .request(app)
        .put(`/api/profiles/${username}`)
        .set('Content-Type', 'application/json')
        .set('authorization', `${token1}${1}`)
        .send(update)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('You do not have permission to this page.');
          if (err) return done(err);
          done();
        });
    });
  });
});
