import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import users from '../database/seed-data/users';

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

  it('should reply a comment', (done) => {
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

  it('should not reply a comment', (done) => {
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

  it('should return error if comment does not exixt', (done) => {
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

  it('should update a reply to a comment', (done) => {
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

  it('should return error if comment does not exixt', (done) => {
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

  it('should not update a reply with invalid id', (done) => {
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

  it('should not update a reply if comment does not exist', (done) => {
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

  it('should not update reply', (done) => {
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
        expect(res.body.message).to.equal('Access denied.');
        done();
      });
  });

  it('should get all replies for a comment', (done) => {
    chai.request(app)
      .get('/api/comments/1/replies')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.replies['0'].body).to.equal('updated reply');
        expect(res.body.replies['1'].body).to.equal('This article is best here too');
        done();
      });
  });

  it('should return error if comment does not exixt', (done) => {
    chai.request(app)
      .get('/api/comments/57/replies')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('Comment does not exist');
        done();
      });
  });

  it('should not delete a comment', (done) => {
    chai.request(app)
      .delete('/api/comments/2/replies/4')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.message).to.equal('Access denied.');
        done();
      });
  });

  it('should return error if comment does not exixt', (done) => {
    chai.request(app)
      .delete('/api/comments/71/replies/1')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('Comment does not exist');
        done();
      });
  });

  it('should return error if reply does not exixt', (done) => {
    chai.request(app)
      .delete('/api/comments/2/replies/20')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('Reply does not exist');
        done();
      });
  });

  it('should delete a reply', (done) => {
    chai.request(app)
      .delete('/api/comments/2/replies/2')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Reply was deleted successfully');
        done();
      });
  });

  describe('Test API endpoints to like a comment in a thread', () => {
    it('should like an existing comment', (done) => {
      chai.request(app)
        .post('/api/replies/1/likes')
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('Successfully liked');
          expect(res.body.commentThreadId).to.equal(1);
          done();
        });
    });

    it('should return a message if comment is already liked', (done) => {
      chai.request(app)
        .post('/api/replies/1/likes')
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal('Reply already liked');
          done();
        });
    });

    it('should return message if comment does not exist', (done) => {
      chai.request(app)
        .post('/api/replies/50/likes')
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal('Reply does not exist');
          done();
        });
    });

    it('should return the count of all likes for a comment in a thread', (done) => {
      chai.request(app)
        .get('/api/replies/1/likes')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.replyId).to.equal(1);
          expect(res.body.likesCount).to.equal(1);
          expect(res.body.likes[0].user.username).to.equal('joeeasy');
          done();
        });
    });

    it('should return nothing if the comment has no likes', (done) => {
      chai.request(app)
        .get('/api/replies/3/likes')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.likes).to.be.empty; //eslint-disable-line
          done();
        });
    });

    it('should return message if comment does not exist when trying to get all likes', (done) => {
      chai.request(app)
        .get('/api/replies/20/likes')
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal('Reply does not exist');
          done();
        });
    });

    it('should return a message if comment has not been liked', (done) => {
      chai.request(app)
        .delete('/api/replies/3/likes')
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal('Reply has not been liked');
          done();
        });
    });

    it('should return a message if comment to be unliked does not exist', (done) => {
      chai.request(app)
        .delete('/api/replies/50/likes')
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal('Reply does not exist');
          done();
        });
    });

    it('should unlike an already liked comment', (done) => {
      chai.request(app)
        .delete('/api/replies/1/likes')
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('Successfully unliked');
          done();
        });
    });
  });
});
