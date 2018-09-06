import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import userFaker from './helpers/userFakeData';

chai.use(chaiHttp);

let userToken;
describe('Get All User Profile', () => {
  before((done) => {
    const newUser = {
      ...userFaker.validUserDetails,
      username: 'cwizard18',
      email: 'cwizard2018@gmail.com'
    };
    chai.request(app)
      .post('/api/users')
      .set('Accept', 'application/json')
      .send({
        user: newUser,
      })
      .end((err, res) => {
        userToken = res.body.user.token;
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
    it('should return error message when page query is zero or less', (done) => {
      chai.request(app)
        .get('/api/profiles?page=0')
        .set('Content-Type', 'application/json')
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Invalid query parameter');
          expect(res.body).not.to.have.property('users');
          if (err) return done(err);
          done();
        });
    });
    it('should return error message when limit query is less than zero', (done) => {
      chai.request(app)
        .get('/api/profiles?limit=-1')
        .set('Content-Type', 'application/json')
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Invalid query parameter');
          expect(res.body).not.to.have.property('users');
          if (err) return done(err);
          done();
        });
    });
    it('should return authentication error when limit query is not numeric', (done) => {
      chai.request(app)
        .get('/api/profiles?limit=a')
        .set('Content-Type', 'application/json')
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors.limit[0])
            .to.equal('limit in the query parameter can only be numbers.');
          expect(res.body).not.to.have.property('users');
          if (err) return done(err);
          done();
        });
    });
    it('should return authentication error when page query is not numeric', (done) => {
      chai.request(app)
        .get('/api/profiles?page=a')
        .set('Content-Type', 'application/json')
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors.page[0])
            .to.equal('page in the query parameter can only be numbers.');
          expect(res.body).not.to.have.property('users');
          if (err) return done(err);
          done();
        });
    });
    it('should return authentication error when order query is invalid', (done) => {
      chai.request(app)
        .get('/api/profiles?order=a')
        .set('Content-Type', 'application/json')
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message)
            .to.equal('order can only be ASC or DESC');
          expect(res.body).not.to.have.property('users');
          if (err) return done(err);
          done();
        });
    });
  });
  describe('When user passed valid query parameter', () => {
    it('should return success status when no user on a page', (done) => {
      chai.request(app)
        .get('/api/profiles?limit=0')
        .set('Content-Type', 'application/json')
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('No user on this page');
          expect(res.body).to.have.property('users');
          expect(res.body.users[0]).to.equal(undefined);
          if (err) return done(err);
          done();
        });
    });
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
});
