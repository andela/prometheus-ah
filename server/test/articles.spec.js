import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import users from '../utils/users';

import app from '../..';

chai.use(chaiHttp);

let userToken;

describe('Articles Endpoint /articles', () => {
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

  it('it should create an article', (done) => {
    const article = {
      title: 'how to code',
      body: 'PHP is a cool framework for coding but not fast as node',
      description: 'coding'
    };
    chai.request(app)
      .post('/api/articles')
      .set('authorization', userToken)
      .send(article)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('article');
        expect(res.body.article).to.have.property('readingTime');
        expect(res.body.article).to.be.an('object');
        done();
      });
  });
  it('should return articles with paginationMeta', (done) => {
    chai.request(app)
      .get('/api/articles?limit=1&page=1&order=DESC')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('articles');
        expect(res.body.articles).to.be.an('array');
        expect(res.body).to.have.property('paginationMeta');
        expect(res.body.paginationMeta.currentPage).to.equal(1);
        expect(res.body.paginationMeta.pageSize).to.equal(1);
        if (err) return done(err);
        done();
      });
  });
  it('should return default when page query  or limit or order doesnt exist', (done) => {
    chai.request(app)
      .get('/api/articles?limit=-3&page=1&order=asdd')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('articles');
        expect(res.body.paginationMeta.currentPage).to.equal(1);
        expect(res.body.paginationMeta.pageSize).to.equal(10);
        if (err) return done(err);
        done();
      });
  });

  it('it should get a single article', (done) => {
    chai.request(app)
      .get('/api/articles/how-to-code')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('it should update an article', (done) => {
    const article = {
      title: 'how to code in python',
      body: 'PHP is a cool framework for coding but not fast as node',
      description: 'coding',
    };
    chai.request(app)
      .put('/api/articles/how-to-code')
      .set('authorization', userToken)
      .send(article)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Article updated successfully');
        done();
      });
  });
  it('it should not update an article since you are not the creator', (done) => {
    const article = {
      title: 'how to code in python',
      body: 'PHP is a cool framework for coding but not fast as node',
      description: 'coding',
    };
    chai.request(app)
      .put('/api/articles/how-to-train-your-dragon-3')
      .set('authorization', userToken)
      .send(article)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Access denied.');
        done();
      });
  });
  it('it should delete an article you created', (done) => {
    chai.request(app)
      .delete('/api/articles/how-to-code')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Article deleted successfully');
        done();
      });
  });

  it('it should not delete an article since you are not the creator', (done) => {
    chai.request(app)
      .delete('/api/articles/how-to-train-your-dragon-3')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Access denied.');
        done();
      });
  });
});

describe('Test Endpoint /articles', () => {
  it('it should not create article', (done) => {
    chai.request(app)
      .post('/api/articles')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('errors');
        expect(res.body).to.have.property('errors').to.be.an('object');
        done();
      });
  });
  it('it should not get an article', (done) => {
    chai.request(app)
      .get('/api/articles/wrong_id')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('message').to.be.equal('Article not found');
        done();
      });
  });
  it('it should not update an article', (done) => {
    chai.request(app)
      .put('/api/articles/wrong_id')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('message').to.be.equal('Article not found');
        done();
      });
  });
  it('it should not delete an article', (done) => {
    chai.request(app)
      .delete('/api/articles/wrong_id')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('message').to.be.equal('Article not found');
        done();
      });
  });
});
