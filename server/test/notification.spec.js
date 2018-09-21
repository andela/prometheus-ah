import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import users from '../database/seed-data/users';

chai.use(chaiHttp);

let userToken1;
let userToken2;

describe('Notification Tests', () => {
  before((done) => {
    chai.request(app)
      .post('/api/users/login')
      .send({
        user: {
          username: users[0].username,
          password: users[2].password1
        }
      })
      .end((err, res) => {
        userToken1 = res.body.user.token;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  before((done) => {
    chai.request(app)
      .post('/api/users/login')
      .send({
        user: {
          username: users[1].username,
          password: users[2].password2
        }
      })
      .end((err, res) => {
        userToken2 = res.body.user.token;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  before((done) => {
    chai.request(app)
      .post('/api/articles/how-to-train-your-dragon-3/comments')
      .set('Content-type', 'application/json')
      .set('authorization', userToken1)
      .send({
        comment: {
          body: 'excellent article'
        }
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.comment.body).to.equal('excellent article');
        expect(res.body.comment.user.username).to.equal('joeeasy');
        done();
      });
  });

  it('should not update notification status for another user', (done) => {
    chai.request(app)
      .put('/api/notifications/status/faksam')
      .set('Content-type', 'application/json')
      .set('authorization', userToken1)
      .send({
        notification: {
          status: 'off'
        }
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.message).to.equal('Access denied.');
        done();
      });
  });

  it('should return if notification status body is invalid', (done) => {
    chai.request(app)
      .put('/api/notifications/status/faksam')
      .set('Content-type', 'application/json')
      .set('authorization', userToken1)
      .send({
        notification: {
          status: 'true'
        }
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.errors).to.equal('status field must be on or off');
        done();
      });
  });

  it('should not get notifications of another user', (done) => {
    chai.request(app)
      .get('/api/notifications/users/faksam')
      .set('authorization', userToken1)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.message).to.equal('Access denied.');
        done();
      });
  });

  it('should get notifications of a user', (done) => {
    chai.request(app)
      .get('/api/notifications/users/faksam')
      .set('authorization', userToken2)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.notificationCount).to.equal(1);
        expect(res.body.notifications[0].createdBy).to.equal('joeeasy');
        done();
      });
  });

  it('should get notifications of a user', (done) => {
    chai.request(app)
      .get('/api/notifications/users/faksam')
      .set('authorization', userToken2)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.notificationCount).to.equal(1);
        expect(res.body.notifications[0].createdBy).to.equal('joeeasy');
        done();
      });
  });

  it('should get an empty array for a user with no notification', (done) => {
    chai.request(app)
      .get('/api/notifications/users/joeeasy')
      .set('authorization', userToken1)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('No notification on this page');
        expect(res.body.notifications).to.be.empty; //eslint-disable-line
        done();
      });
  });

  it('should update notification status for a user', (done) => {
    chai.request(app)
      .put('/api/notifications/status/joeeasy')
      .set('Content-type', 'application/json')
      .set('authorization', userToken1)
      .send({
        notification: {
          status: 'off'
        }
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.notification.status).to.equal('off');
        expect(res.body.message).to.equal('Notification updated successfully');
        done();
      });
  });

  it('should not get notifications when status is off', (done) => {
    chai.request(app)
      .get('/api/notifications/users/joeeasy')
      .set('authorization', userToken1)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.message).to.equal('Access denied.');
        done();
      });
  });

  it('should return message if notification to be read does not exist', (done) => {
    chai.request(app)
      .put('/api/notifications/reads')
      .set('authorization', userToken2)
      .set('Content-type', 'application/json')
      .send({
        articleSlug: 'this-is-how-i-feel-6',
        userId: 2,
        commentId: 50
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('Notification does not exist');
        done();
      });
  });

  it('should return message if user tries to access another user notification', (done) => {
    chai.request(app)
      .put('/api/notifications/reads')
      .set('authorization', userToken1)
      .set('Content-type', 'application/json')
      .send({
        articleSlug: 'how-to-train-your-dragon-3',
        userId: 2,
        commentId: 6
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.message).to.equal('Access denied.');
        done();
      });
  });

  it('should return errors if notification body is empty', (done) => {
    chai.request(app)
      .put('/api/notifications/reads')
      .set('authorization', userToken1)
      .set('Content-type', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.errors.articleSlug[0]).to.equal('articleSlug field cannot be empty');
        expect(res.body.errors.userId[0]).to.equal('userId field cannot be empty');
        done();
      });
  });

  it('should return message if user reads a notification', (done) => {
    chai.request(app)
      .put('/api/notifications/reads')
      .set('authorization', userToken2)
      .set('Content-type', 'application/json')
      .send({
        articleSlug: 'how-to-train-your-dragon-3',
        userId: 2,
        commentId: 6
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Notification has been read');
        done();
      });
  });

  it('should return message if notification is alraedy read', (done) => {
    chai.request(app)
      .put('/api/notifications/reads')
      .set('authorization', userToken2)
      .set('Content-type', 'application/json')
      .send({
        articleSlug: 'how-to-train-your-dragon-3',
        userId: 2,
        commentId: 6
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('Notification has already been read');
        done();
      });
  });
});
