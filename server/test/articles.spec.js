import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import users from '../database/seed-data/users';

import app from '../../index';

chai.use(chaiHttp);

let userToken;
let userToken2;
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

  it('should create an article', (done) => {
    const article = {
      title: 'how to cook',
      body: 'PHP is a cool framework for coding but not fast as node',
      description: 'coding',
      status: 'publish',
      tagList: ['PHP', 'coding', 'framework'],
    };
    chai.request(app)
      .post('/api/articles')
      .set('authorization', userToken)
      .send(article)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('article');
        expect(res.body).to.have.property('tags');
        expect(res.body.article).to.have.property('readingTime');
        expect(res.body.article).to.be.an('object');
        expect(res.body.tags).to.be.an('array').that.includes('coding');
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

  it('should return articles with query title parameter', (done) => {
    chai.request(app)
      .get('/api/articles?title=how to cook')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('articles');
        expect(res.body.articles).to.be.an('array');
        expect(res.body.articles[0].title).to.equal('how to cook');
        if (err) return done(err);
        done();
      });
  });


  it('should return articles with query user parameter if user is not logged in', (done) => {
    chai.request(app)
      .get('/api/articles?user=faksam')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('articles');
        expect(res.body.articles).to.be.an('array');
        expect(res.body.articles[0].userId).to.equal(2);
        if (err) return done(err);
        done();
      });
  });

  it('should return articles with query user parameter if user is logged in', (done) => {
    chai.request(app)
      .get('/api/articles?user=faksam')
      .set('authorization', userToken)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('articles');
        expect(res.body.articles).to.be.an('array');
        expect(res.body.articles[0].userId).to.equal(2);
        if (err) return done(err);
        done();
      });
  });

  it('should return default when page query or limit or order doesnt exist', (done) => {
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

  it('should get a single article', (done) => {
    chai.request(app)
      .get('/api/articles/how-to-cook')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should update an article', (done) => {
    const article = {
      title: 'how to wash',
      body: 'PHP is a cool framework for coding but not fast as node',
      description: 'coding',
      status: 'publish',
      tagList: ['coding', 'framework']
    };
    chai.request(app)
      .put('/api/articles/how-to-cook')
      .set('authorization', userToken)
      .send(article)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('tags');
        expect(res.body.message).to.equal('Article updated successfully');
        expect(res.body.tags).to.be.an('array').that.includes('framework');
        done();
      });
  });

  it('should not update an article since you are not the creator', (done) => {
    const article = {
      title: 'how to code in python',
      body: 'PHP is a cool framework for coding but not fast as node',
      description: 'coding',
      status: 'publish',
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

  it('it should not update article if invalid request body sent', (done) => {
    chai.request(app)
      .put('/api/articles/how-to-cook')
      .set('authorization', userToken)
      .send({ invalidKey: 'a' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('errors');
        done();
      });
  });
  it('should not delete an article created by another user', (done) => {
    chai.request(app)
      .delete('/api/articles/how-to-cook')
      .set('authorization', userToken2)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.message).to.equal('Access denied.');
        done();
      });
  });
  it('should delete an article you created', (done) => {
    chai.request(app)
      .delete('/api/articles/how-to-cook')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Article deleted successfully');
        done();
      });
  });

  it('should not delete an article since you are not the creator', (done) => {
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
  it('should not create article', (done) => {
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
  it('should not get an article', (done) => {
    chai.request(app)
      .get('/api/articles/wrong_id')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('message').to.be.equal('Article not found');
        done();
      });
  });
  it('it should not update article if title length less than 3', (done) => {
    chai.request(app)
      .put('/api/articles/how-to-code')
      .set('authorization', userToken)
      .send({ title: 'a' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('errors');
        expect(res.body).to.have.property('errors').to.be.an('object');
        done();
      });
  });
  it('should not update an article since article does not exist', (done) => {
    const article = {
      title: 'how to code in python',
      body: 'PHP is a cool framework for coding but not fast as node',
      description: 'coding',
      status: 'publish',
    };
    chai.request(app)
      .put('/api/articles/wrong_id')
      .set('authorization', userToken)
      .send(article)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('message').to.be.equal('Article not found');
        done();
      });
  });
  it('should not delete an article', (done) => {
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

  it('should return featured articles', (done) => {
    chai.request(app)
      .get('/api/featuredArticles')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.articles.length).to.equal(5);
        expect(res.body.articles[0].slug).to.equal(process.env.FT_ARTICLE_1);
        done();
      });
  });
});


describe('Test Endpoint /articles/feed', () => {
  it('should return an error when user token is invalid', (done) => {
    chai.request(app)
      .get('/api/articles/feed')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('You need to signup or login to perform this action');
        done();
      });
  });

  it('should login a user', (done) => {
    chai.request(app)
      .post('/api/users/login')
      .send({
        user: {
          username: users[8].username,
          password: users[2].password2
        }
      })
      .end((err, res) => {
        userToken = res.body.user.token;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should return articles of authors followed by user', (done) => {
    chai.request(app)
      .get('/api/articles/feed')
      .set('Content-Type', 'application/json')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('articles');
        expect(res.body.articles).to.be.an('array');
        expect(res.body).to.have.property('paginationMeta');
        expect(res.body.paginationMeta.currentPage).to.equal(1);
        expect(res.body.paginationMeta.pageSize).to.equal(10);
        expect(res.body.articles[0].slug)
          .to.equal('the-purpose-of-life-is-not-happiness-its-usefulness');
        expect(res.body.articles.length).to.equal(9);
        if (err) return done(err);
        done();
      });
  });
});

describe('Articles POST /api/articles/', () => {
  before((done) => {
    chai.request(app)
      .post('/api/users/login')
      .send({
        user: {
          username: users[9].username,
          password: users[2].password2
        }
      })
      .end((err, res) => {
        userToken = res.body.user.token;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  /**
   * @description - PUT (should not create an article when user is not verified)
   */
  it('should not create an article when user is not verified', (done) => {
    const article = {
      title: 'how to code',
      body: 'PHP is a cool framework for coding but not fast as node',
      description: 'coding',
      tagList: ['PHP', 'coding', 'framework'],
    };
    chai.request(app)
      .post('/api/articles')
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
});
