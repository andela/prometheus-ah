import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import users from '../utils/users';

chai.use(chaiHttp);

let userToken;

describe('Test API endpoint to comment on articles', () => {
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

  it('it should create a comment', (done) => {
    chai.request(app)
      .post('/api/articles/how-to-train-your-dragon/comments')
      .set('Content-type', 'application/json')
      .set('authorization', userToken)
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

  it('it should not create a comment', (done) => {
    chai.request(app)
      .post('/api/articles/how-to-train-your-dragon2/comments')
      .set('Content-type', 'application/json')
      .set('authorization', userToken)
      .send({
        comment: {
          body: ''
        }
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.errors.body[0]).to.equal('body field cannot be empty');
        done();
      });
  });

  it('it should return error if article does not exixt', (done) => {
    chai.request(app)
      .post('/api/articles/how-to-train-me/comments')
      .set('Content-type', 'application/json')
      .set('authorization', userToken)
      .send({
        comment: {
          body: 'excellent article'
        }
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('Article does not exist');
        done();
      });
  });

  it('it should update a comment for an article', (done) => {
    chai.request(app)
      .put('/api/articles/how-to-train-your-dragon/comments/5')
      .set('Content-type', 'application/json')
      .set('authorization', userToken)
      .send({
        comment: {
          body: 'updated article'
        }
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.comment.body).to.equal('updated article');
        expect(res.body.comment.user.username).to.equal('joeeasy');
        done();
      });
  });

  it('it should return error if comment does not exixt', (done) => {
    chai.request(app)
      .put('/api/articles/how-to-train-your-dragon/comments/24')
      .set('Content-type', 'application/json')
      .set('authorization', userToken)
      .send({
        comment: {
          body: 'excellent article'
        }
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('Comment does not exist');
        done();
      });
  });

  it('it should not update a comment with invalid id', (done) => {
    chai.request(app)
      .put('/api/articles/how-to-train-your-dragon2/comments/-7')
      .set('Content-type', 'application/json')
      .set('authorization', userToken)
      .send({
        comment: {
          body: 'updated article'
        }
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.errors).to.equal('The comment id must be a positive integer');
        done();
      });
  });

  it('it should not update a comment if article does not exist', (done) => {
    chai.request(app)
      .put('/api/articles/how-to-train-your-dragon24/comments/7')
      .set('Content-type', 'application/json')
      .set('authorization', userToken)
      .send({
        comment: {
          body: 'updated article'
        }
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('Article does not exist');
        done();
      });
  });

  it('it should not update comment', (done) => {
    chai.request(app)
      .put('/api/articles/how-to-train-your-dragon/comments/4')
      .set('Content-type', 'application/json')
      .set('authorization', userToken)
      .send({
        comment: {
          body: 'excellent article'
        }
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.message).to.equal('Access denied.');
        done();
      });
  });

  it('it should get all comment', (done) => {
    chai.request(app)
      .get('/api/articles/how-to-train-your-dragon/comments')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.comments['0'].body).to.equal('This article is hot');
        expect(res.body.comments['1'].body).to.equal('This article is correct');
        expect(res.body.comments['2'].body).to.equal('updated article');
        done();
      });
  });

  it('it should return message if no comments', (done) => {
    chai.request(app)
      .get('/api/articles/how-to-train-your-dragon-3/comments')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('There are no comments for this article');
        done();
      });
  });

  it('it should return error if article does not exixt', (done) => {
    chai.request(app)
      .get('/api/articles/how-to-train-your/comments')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('Article does not exist');
        done();
      });
  });

  it('it should delete a comment', (done) => {
    chai.request(app)
      .delete('/api/articles/how-to-train-your-dragon/comments/5')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Comment was deleted successfully');
        done();
      });
  });

  it('it should not delete a comment', (done) => {
    chai.request(app)
      .delete('/api/articles/how-to-train-your-dragon/comments/4')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.message).to.equal('Access denied.');
        done();
      });
  });

  it('it should return error if article does not exixt', (done) => {
    chai.request(app)
      .delete('/api/articles/how-to-train-me/comments/7')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('Article does not exist');
        done();
      });
  });

  it('it should return error if comment does not exixt', (done) => {
    chai.request(app)
      .delete('/api/articles/how-to-train-your-dragon-2/comments/77')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('Comment does not exist');
        done();
      });
  });
});
