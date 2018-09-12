import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../..';
import admins from '../database/seed-data/admins';
import users from '../database/seed-data/users';

chai.use(chaiHttp);

let userToken;
let adminToken;

describe('Admin controller', () => {
  before((done) => {
    chai.request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send({
        user: {
          username: admins[3].username,
          password: admins[7].password4
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
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send({
        user: {
          username: admins[0].username,
          password: admins[7].password1
        }
      })
      .end((err, res) => {
        adminToken = res.body.user.token;
        if (err) return done(err);
        done();
      });
  });
  describe('Block a user', () => {
    it('should not block user if the request is not from admin', (done) => {
      const { username } = admins[2];
      chai
        .request(app)
        .put(`/api/admin/${username}/block`)
        .set('Content-Type', 'application/json')
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Access denied');
          if (err) return done(err);
          done();
        });
    });
    it('should not block any user if the user name does not exist in the database', (done) => {
      const username = 'unknown';
      chai
        .request(app)
        .put(`/api/admin/${username}/block`)
        .set('Content-Type', 'application/json')
        .set('authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('User not found');
          if (err) return done(err);
          done();
        });
    });
    it('should block a user', (done) => {
      const { username } = admins[2];
      chai
        .request(app)
        .put(`/api/admin/${username}/block`)
        .set('Content-Type', 'application/json')
        .set('authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('User is successfully blocked');
          expect(res.body).to.have.property('user');
          expect(res.body.user).to.be.an('object');
          if (err) return done(err);
          done();
        });
    });
    it('should not block a user that is already blocked', (done) => {
      const { username } = admins[2];
      chai
        .request(app)
        .put(`/api/admin/${username}/block`)
        .set('Content-Type', 'application/json')
        .set('authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('This user has already been blocked');
          if (err) return done(err);
          done();
        });
    });
    it('should not block a super admin user', (done) => {
      const { username } = admins[0];
      chai
        .request(app)
        .put(`/api/admin/${username}/block`)
        .set('Content-Type', 'application/json')
        .set('authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('You are not allowed to block an admin');
          if (err) return done(err);
          done();
        });
    });
    it('should not log in a blocked user', (done) => {
      chai
        .request(app)
        .post('/api/users/login')
        .set('Content-Type', 'application/json')
        .send({
          user: {
            username: admins[1].username,
            password: admins[7].password2
          }
        })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to
            .equal('You have been blocked from accessing this site, contact the admin');
          if (err) return done(err);
          done();
        });
    });
  });
  describe('Unblock a user', () => {
    it('should not unblock user if the request is not from admin', (done) => {
      const { username } = admins[2];
      chai
        .request(app)
        .put(`/api/admin/${username}/unblock`)
        .set('Content-Type', 'application/json')
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Access denied');
          if (err) return done(err);
          done();
        });
    });
    it('should not unblock any user if the user is not blocked', (done) => {
      const { username } = admins[3];
      chai
        .request(app)
        .put(`/api/admin/${username}/unblock`)
        .set('Content-Type', 'application/json')
        .set('authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('This user is not blocked');
          if (err) return done(err);
          done();
        });
    });
    it('should not unblock any user if the user is not in the database', (done) => {
      const username = 'unknown';
      chai
        .request(app)
        .put(`/api/admin/${username}/unblock`)
        .set('Content-Type', 'application/json')
        .set('authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('User not found');
          if (err) return done(err);
          done();
        });
    });
    it('should unblock a user', (done) => {
      const { username } = admins[1];
      chai
        .request(app)
        .put(`/api/admin/${username}/unblock`)
        .set('Content-Type', 'application/json')
        .set('authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('User is successfully unblocked');
          expect(res.body).to.have.property('user');
          expect(res.body.user).to.be.an('object');
          if (err) return done(err);
          done();
        });
    });
  });
  describe('Get blocked users', () => {
    it('should grant access to blocked user list when the request is from admin', (done) => {
      chai
        .request(app)
        .get('/api/admin/blocked')
        .set('Content-Type', 'application/json')
        .set('authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('paginationMeta');
          expect(res.body.paginationMeta).to.be.an('object');
          expect(res.body).to.have.property('blockedUsers');
          expect(res.body.blockedUsers).to.be.an('array');
          if (err) return done(err);
          done();
        });
    });
    it('should return default page for invalid parameters', (done) => {
      chai
        .request(app)
        .get('/api/admin/blocked?order=abc')
        .set('Content-Type', 'application/json')
        .set('authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('paginationMeta');
          expect(res.body.paginationMeta).to.be.an('object');
          expect(res.body).to.have.property('blockedUsers');
          expect(res.body.blockedUsers).to.be.an('array');
          if (err) return done(err);
          done();
        });
    });
    it(
      'should deny access to blocked user list if request is not from authenticated user',
      (done) => {
        chai
          .request(app)
          .get('/api/admin/blocked')
          .set('Content-Type', 'application/json')
          .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(res.body.message).to.equal('You need to signup or login to perform this action');
            if (err) return done(err);
            done();
          });
      }
    );
    it('should deny access to blocked user list if request is not from an admin', (done) => {
      chai
        .request(app)
        .get('/api/admin/blocked')
        .set('Content-Type', 'application/json')
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.message).to.equal('Access denied');
          if (err) return done(err);
          done();
        });
    });
  });
  describe('Create and remove an admin', () => {
    it('should not create admin if user is not logged in', (done) => {
      const { username } = admins[2];
      chai
        .request(app)
        .put(`/api/admin/${username}/create`)
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('You need to signup or login to perform this action');
          expect(res.body).not.to.have.property('user');
          if (err) return done(err);
          done();
        });
    });
    it('should not create an admin if user does not exist', (done) => {
      const username = 'unknown';
      chai
        .request(app)
        .put(`/api/admin/${username}/create`)
        .set('Content-Type', 'application/json')
        .set('authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to
            .equal('User not found');
          expect(res.body).not.to.have.property('user');
          if (err) return done(err);
          done();
        });
    });
    it('should not create admin if request is not from super admin', (done) => {
      const { username } = admins[2];
      chai
        .request(app)
        .put(`/api/admin/${username}/create`)
        .set('Content-Type', 'application/json')
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.message).to.equal('Access denied');
          expect(res.body).not.to.have.property('user');
          if (err) return done(err);
          done();
        });
    });
    it('should not create an admin if user has been previously blocked', (done) => {
      const { username } = admins[6];
      chai
        .request(app)
        .put(`/api/admin/${username}/create`)
        .set('Content-Type', 'application/json')
        .set('authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to
            .equal('This user has been blocked, unblock before updating role to admin');
          expect(res.body).not.to.have.property('user');
          if (err) return done(err);
          done();
        });
    });
    it('should create an admin if request is from super admin', (done) => {
      const { username } = users[3];
      chai
        .request(app)
        .put(`/api/admin/${username}/create`)
        .set('Content-Type', 'application/json')
        .set('authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('User successfully ugraded to admin');
          expect(res.body).to.have.property('user');
          if (err) return done(err);
          done();
        });
    });
    it('should not create an admin if user is already an admin', (done) => {
      const { username } = users[3];
      chai
        .request(app)
        .put(`/api/admin/${username}/create`)
        .set('Content-Type', 'application/json')
        .set('authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.body.message).to.equal('This user is already an admin');
          expect(res.body).not.to.have.property('user');
          if (err) return done(err);
          done();
        });
    });
    it('should not remove admin if user is not logged in', (done) => {
      const { username } = users[3];
      chai
        .request(app)
        .put(`/api/admin/${username}/remove`)
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('You need to signup or login to perform this action');
          expect(res.body).not.to.have.property('user');
          if (err) return done(err);
          done();
        });
    });
    it('should not remove an admin if user is not an admin', (done) => {
      const { username } = users[0];
      chai
        .request(app)
        .put(`/api/admin/${username}/remove`)
        .set('Content-Type', 'application/json')
        .set('authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.body.message).to.equal('This user is not an admin');
          expect(res.body).not.to.have.property('user');
          if (err) return done(err);
          done();
        });
    });
    it('should not remove an admin if user does not exist', (done) => {
      const username = 'unknown';
      chai
        .request(app)
        .put(`/api/admin/${username}/remove`)
        .set('Content-Type', 'application/json')
        .set('authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to
            .equal('User not found');
          expect(res.body).not.to.have.property('user');
          if (err) return done(err);
          done();
        });
    });
    it('should not remove a super admin', (done) => {
      const { username } = admins[0];
      chai
        .request(app)
        .put(`/api/admin/${username}/remove`)
        .set('Content-Type', 'application/json')
        .set('authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.body.message).to
            .equal('You cannot block and remove a super admin');
          expect(res.body).not.to.have.property('user');
          if (err) return done(err);
          done();
        });
    });
    it('should not remove admin if request is not from super admin', (done) => {
      const { username } = users[3];
      chai
        .request(app)
        .put(`/api/admin/${username}/remove`)
        .set('Content-Type', 'application/json')
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.message).to.equal('Access denied');
          expect(res.body).not.to.have.property('user');
          if (err) return done(err);
          done();
        });
    });
    it('should remove and block an admin', (done) => {
      const { username } = users[4];
      chai
        .request(app)
        .put(`/api/admin/${username}/remove`)
        .set('Content-Type', 'application/json')
        .set('authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to
            .equal('You have removed the admin privileges and successfully blocked this user');
          expect(res.body).to.have.property('user');
          if (err) return done(err);
          done();
        });
    });
  });
});
