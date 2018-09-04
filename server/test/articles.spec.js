import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import userFaker from './helpers/userFakeData';

import app from '../..';

chai.use(chaiHttp);

let userToken;

describe('Articles Endpoint /articles', () => {
  before((done) => {
    chai.request(app)
      .post('/api/users/login')
      .send({
        user: userFaker.validUserDetails
      })
      .end((err, res) => {
        userToken = res.body.user.token;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('it should get a single article', (done) => {
    chai.request(app)
      .get('/api/articles/2')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('it should get all articles', (done) => {
    chai.request(app)
      .get('/api/articles')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('article');
        expect(res.body).to.have.property('article').to.be.an('array');
        done();
      });
  });

  it('it should create an article', (done) => {
    const article = {
      title: 'how to code in ruby2',
      body: 'PHP is a cool framework for coding but not fast as node',
      slug: 'how_to_code_in_ruby'
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

  it('it should update an article', (done) => {
    const article = {
      title: 'how to code in python',
      body: 'PHP is a cool framework for coding but not fast as node',
      description: 'coding',
    };
    chai.request(app)
      .put('/api/articles/2')
      .set('authorization', userToken)
      .send(article)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Updated article successfully');
        done();
      });
  });

  it('it should delete an article', (done) => {
    chai.request(app)
      .delete('/api/articles/3')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Deleted article successfully');
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
        expect(res.body).to.have.property('errors');
        expect(res.body).to.have.property('errors').to.be.an('object');
        done();
      });
  });
  it('it should not update an article', (done) => {
    chai.request(app)
      .put('/api/articles/wrong_id')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('errors');
        expect(res.body).to.have.property('errors').to.be.an('object');
        done();
      });
  });
  it('it should not delete an article', (done) => {
    chai.request(app)
      .delete('/api/articles/wrong_id')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('errors');
        expect(res.body).to.have.property('errors').to.be.an('object');
        done();
      });
  });
});
