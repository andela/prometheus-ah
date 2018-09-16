import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import users from '../database/seed-data/users';

import app from '../../index';

chai.use(chaiHttp);

let userToken;
let userToken1;
describe('ReadStats Endpoint /readstats', () => {
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
        userToken1 = res.body.user.token;
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
  it('it should get a single article', (done) => {
    chai.request(app)
      .get('/api/articles/how-to-code')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should get the read article', (done) => {
    chai.request(app)
      .get('/api/readstats')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Articles read by you');
        expect(res.body).to.have.property('numberOfArticlesRead');
        expect(res.body).to.have.property('readArticles');
        expect(res.body.readArticles).to.be.an('array');
        // expect(res.body.readArticles[0]).to.equal('how-to-code');
        done();
      });
  });
  it('should not get the read article when a user has not read anything', (done) => {
    chai.request(app)
      .get('/api/readstats')
      .set('authorization', userToken1)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('readArticles');
        expect(res.body.readArticles).to.be.an('array');
        
        expect(res.body.readArticles).to.be.empty; // eslint-disable-line
        done();
      });
  });
});
