import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import users from '../database/seed-data/users';

chai.use(chaiHttp);

let userToken;
let userToken2;
describe('Likes Endpoint /articles/:slug', () => {
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
  it('it should create an article', (done) => {
    const article = {
      title: 'how to code',
      body: 'PHP is a cool framework for coding but not fast as node',
      description: 'coding',
      status: 'publish',
    };
    chai.request(app)
      .post('/api/articles')
      .set('authorization', userToken)
      .send(article)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('article');
        expect(res.body.article).to.be.an('object');
        done();
      });
  });
  it('should create a like', (done) => {
    const slug = 'how-to-code';
    chai.request(app)
      .post(`/api/articles/${slug}/like`)
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(201);
        expect(res.body.message).to.equal('Successfully liked');
        done();
      });
  });
  it('should unlike an already liked article', (done) => {
    const slug = 'how-to-code';
    chai.request(app)
      .delete(`/api/articles/${slug}/unlike`)
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('unliked successfully');
        expect(res.status).to.equal(200);
        done();
      });
  });
  it('should send error message when trying to like a non-existing article', (done) => {
    const slug = 'how-to-sing';
    chai.request(app)
      .post(`/api/articles/${slug}/like`)
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('error');
        expect(res.body.error.message).to.equal('Article does not exist');
        done();
      });
  });
  it('should be able to dislike an article', (done) => {
    const slug = 'how-to-code';
    chai.request(app)
      .post(`/api/articles/${slug}/dislike`)
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(201);
        expect(res.body.message).to.equal('Successfully disliked');
        done();
      });
  });
  it('should create a new like', (done) => {
    const slug = 'how-to-code';
    chai.request(app)
      .post(`/api/articles/${slug}/like`)
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Successfully liked');
        done();
      });
  });
  it('should send error message when wrong article is passed', (done) => {
    const slug = 'how-to-sing';
    chai.request(app)
      .post(`/api/articles/${slug}/dislike`)
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('error');
        expect(res.body.error.message).to.equal('article not found');
        done();
      });
  });
  it('should update the already disliked article', (done) => {
    const slug = 'how-to-code';
    chai.request(app)
      .post(`/api/articles/${slug}/dislike`)
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('Successfully disliked');
        expect(res.status).to.equal(200);
        done();
      });
  });
});

describe('Get all likes', () => {
  it('should count and return all likes', (done) => {
    const slug = 'how-to-code';
    chai.request(app)
      .get(`/api/articles/${slug}/like`)
      .end((err, res) => {
        expect(res.body).to.have.property('paginationMeta');
        expect(res.body).to.have.property('slug');
        expect(res.body).to.have.property('usersLiked');
        expect(res.status).to.equal(200);
        done();
      });
  });
  it('should count and return dislikes', (done) => {
    const slug = 'how-to-code';
    chai.request(app)
      .get(`/api/articles/${slug}/dislike`)
      .end((err, res) => {
        expect(res.body).to.have.property('paginationMeta');
        expect(res.body).to.have.property('slug');
        expect(res.body).to.have.property('usersDisliked');
        expect(res.status).to.equal(200);
        done();
      });
  });
  it('should return error when no likes is found', (done) => {
    const slug = 'how-to-code';
    chai.request(app)
      .delete(`/api/articles/${slug}/unlike`)
      .set('authorization', userToken2)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body.error.message).to.equal('Have not liked or disliked before');
        done();
      });
  });

  it('should return error when the article doesn\'t exist', (done) => {
    const slug = 'how-to-sing';
    chai.request(app)
      .get(`/api/articles/${slug}/like`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('error');
        expect(res.body.error.message).to.equal('article not found');
        done();
      });
  });
  it('should return error when the article doesn\'t exist', (done) => {
    const slug = 'how-to-sing';
    chai.request(app)
      .get(`/api/articles/${slug}/dislike`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('error');
        expect(res.body.error.message).to.equal('article not found');
        done();
      });
  });
  it('should return no likes', (done) => {
    const slug = 'how-to-train-your-dragon';
    chai.request(app)
      .get(`/api/articles/${slug}/like`)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('paginationMeta');
        expect(res.body).to.have.property('slug');
        expect(res.status).to.equal(200);
        done();
      });
  });
  it('should return no dislikes', (done) => {
    const slug = 'how-to-train-your-dragon';
    chai.request(app)
      .get(`/api/articles/${slug}/dislike`)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('paginationMeta');
        expect(res.body).to.have.property('slug');
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('should return the like status for an article', (done) => {
    const slug = 'how-to-code';
    chai.request(app)
      .get(`/api/articles/${slug}/likes`)
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.userLikes).to.equal(true);
        done();
      });
  });
  it('should return the like status for an article', (done) => {
    const slug = 'how-to-code';
    chai.request(app)
      .get(`/api/articles/${slug}/likes`)
      .set('authorization', userToken2)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.userLikes).to.equal(false);
        done();
      });
  });
});
