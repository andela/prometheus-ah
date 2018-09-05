import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import users from '../utils/users';

chai.use(chaiHttp);

let userToken;

describe('Test API endpoint to replies on comments', () => {
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
        userToken = res.body.user.token;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('it should reply a comment', (done) => {
    chai.request(app)
      .post('/api/comments/1/replies')
      .set('Content-type', 'application/json')
      .set('authorization', userToken)
      .send({
        reply: {
          body: 'excellent comment'
        }
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.reply.body).to.equal('excellent comment');
        expect(res.body.reply.user.username).to.equal('joeeasy');
        done();
      });
  });

  it('it should not reply a comment', (done) => {
    chai.request(app)
      .post('/api/comments/1/replies')
      .set('Content-type', 'application/json')
      .set('authorization', userToken)
      .send({
        reply: {
          body: ''
        }
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.errors.body[0]).to.equal('body field cannot be empty');
        done();
      });
  });

  it('it should return error if comment does not exixt', (done) => {
    chai.request(app)
      .post('/api/comments/55/replies')
      .set('Content-type', 'application/json')
      .set('authorization', userToken)
      .send({
        reply: {
          body: 'excellent article'
        }
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('Comment does not exist');
        done();
      });
  });

  it('it should update a reply to a comment', (done) => {
    chai.request(app)
      .put('/api/comments/2/replies/1')
      .set('Content-type', 'application/json')
      .set('authorization', userToken)
      .send({
        reply: {
          body: 'updated reply'
        }
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.reply.body).to.equal('updated reply');
        expect(res.body.reply.user.username).to.equal('joeeasy');
        done();
      });
  });

  it('it should return error if comment does not exixt', (done) => {
    chai.request(app)
      .put('/api/comments/24/replies/1')
      .set('Content-type', 'application/json')
      .set('authorization', userToken)
      .send({
        reply: {
          body: 'excellent article'
        }
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('Comment does not exist');
        done();
      });
  });

  it('it should not update a reply with invalid id', (done) => {
    chai.request(app)
      .put('/api/comments/-7/replies/1')
      .set('Content-type', 'application/json')
      .set('authorization', userToken)
      .send({
        reply: {
          body: 'updated article'
        }
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.errors.commentId[0]).to.equal('The comment id must be a positive integer');
        done();
      });
  });

  it('it should not update a reply if comment does not exist', (done) => {
    chai.request(app)
      .put('/api/comments/2/replies/44')
      .set('Content-type', 'application/json')
      .set('authorization', userToken)
      .send({
        reply: {
          body: 'updated article'
        }
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('Reply does not exist');
        done();
      });
  });

  it('it should not update reply', (done) => {
    chai.request(app)
      .put('/api/comments/2/replies/3')
      .set('Content-type', 'application/json')
      .set('authorization', userToken)
      .send({
        reply: {
          body: 'excellent article'
        }
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.message).to.equal('Access denied');
        done();
      });
  });

  it('it should get a reply', (done) => {
    chai.request(app)
      .get('/api/comments/1/replies/1')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.reply.body).to.equal('updated reply');
        expect(res.body.reply.user.username).to.equal('joeeasy');
        done();
      });
  });

  it('it should return error if comment does not exixt', (done) => {
    chai.request(app)
      .get('/api/comments/20/replies/1')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('Comment does not exist');
        done();
      });
  });

  it('it should return error if reply does not exixt', (done) => {
    chai.request(app)
      .get('/api/comments/2/replies/10')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('Reply does not exist');
        done();
      });
  });

  it('it should not get a reply', (done) => {
    chai.request(app)
      .get('/api/comments/2/replies/10')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('Reply does not exist');
        done();
      });
  });

  it('it should get all replies for a comment', (done) => {
    chai.request(app)
      .get('/api/comments/1/replies')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.replies.length).to.equal(3);
        expect(res.body.replies[0].body).to.equal('updated reply');
        expect(res.body.replies[1].body).to.equal('This article is best here too');
        done();
      });
  });

  it('it should return message if no replies', (done) => {
    chai.request(app)
      .get('/api/comments/3/replies')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('There are no replies for this comment');
        done();
      });
  });

  it('it should return error if comment does not exixt', (done) => {
    chai.request(app)
      .get('/api/comments/57/replies')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('Comment does not exist');
        done();
      });
  });

  it('it should not delete a comment', (done) => {
    chai.request(app)
      .delete('/api/comments/2/replies/4')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.message).to.equal('Access denied');
        done();
      });
  });

  it('it should return error if comment does not exixt', (done) => {
    chai.request(app)
      .delete('/api/comments/71/replies/1')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('Comment does not exist');
        done();
      });
  });

  it('it should return error if reply does not exixt', (done) => {
    chai.request(app)
      .delete('/api/comments/2/replies/20')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('Reply does not exist');
        done();
      });
  });

  it('it should delete a reply', (done) => {
    chai.request(app)
      .delete('/api/comments/2/replies/2')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Reply was deleted successfully');
        done();
      });
  });
});
