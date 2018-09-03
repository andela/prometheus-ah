import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../..';

chai.use(chaiHttp);

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTUzNjEzMTM4MCwiZXhwIjoxNTM2MjE3NzgwfQ.F_7gWmt3q5JSMeK5XK_k1T1x5YRi9Frny4uVP4ZxWdI';

describe('Articles Endpoint /articles', () => {
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
      title: 'how to code in ruby',
      body: 'PHP is a cool framework for coding but not fast as node',
      slug: 'how_to_code_in_ruby'
    };
    chai.request(app)
      .post('/api/articles')
      .set('authorization', token)
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
      .set('authorization', token)
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
      .set('authorization', token)
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
      .set('authorization', token)
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
      .set('authorization', token)
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
      .set('authorization', token)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('errors');
        expect(res.body).to.have.property('errors').to.be.an('object');
        done();
      });
  });
});
