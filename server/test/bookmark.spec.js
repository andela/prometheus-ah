import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import users from '../database/seed-data/users';

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

  before((done) => {
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
        expect(res.body.article).to.be.an('object');
        done();
      });
  });

  it('it should bookmark an article', (done) => {
    chai.request(app)
      .post('/api/articles/user/bookmarks/how-to-code')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.equal('Article bookmarked successfuly');
        done();
      });
  });

  it('it should remove already bookmarked article', (done) => {
    chai.request(app)
      .post('/api/articles/user/bookmarks/how-to-code')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.equal('Bookmark removed successfully');
        done();
      });
  });

  it('it should get all bookmarked', (done) => {
    chai.request(app)
      .get('/api/articles/user/bookmarks')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('bookmark');
        expect(res.body).to.have.property('bookmark').to.be.an('array');
        done();
      });
  });
});
