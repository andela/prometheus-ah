import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import users from '../database/seed-data/users';

chai.use(chaiHttp);
let userToken;
describe('Tests API endpoint to rate articles', () => {
  /**
   * @description - POST (it should login a valid user)
  */
  before((done) => {
    chai.request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send({
        user: {
          username: users[0].username,
          password: users[2].password1
        }
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Welcome User you are now logged in.');
        userToken = res.body.user.token;
        done();
      });
  });
  describe('GET /api/articles/:slug/ratings/', () => {
    /**
     * @description - GET (it should return all ratings for a specific article)
     */
    it('should return all ratings for a specific article', (done) => {
      chai.request(app)
        .get('/api/articles/how-to-train-your-dragon/ratings/')
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Article ratings successfully retrieved');
          expect(res.body).to.have.property('ratings');
          expect(res.body).to.have.property('average');
          expect(res.body.ratings[0].articleId).to.equal(1);
          expect(res.body.ratings[0].rating).to.equal(4);
          expect(res.body.ratings[1].articleId).to.equal(1);
          expect(res.body.ratings[1].rating).to.equal(4);
          done();
        });
    });
    /**
     * @description - GET - (it should return an error when an passed an invalid article slug)
     */
    it('should return an error when passed an invalid article slug', (done) => {
      chai.request(app)
        .get('/api/articles/error/ratings/')
        .set('authorization', `${userToken}`)
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('errors');
          expect(res.body.errors.message).to.equal('Article not found');
          done();
        });
    });
    /**
     * @description - GET - (it should return an error when an passed an invalid article slug)
     */
    it('should not return any rating when page is beyond ', (done) => {
      chai.request(app)
        .get('/api/articles/how-to-train-your-dragon/ratings?page=12')
        .set('Content-Type', 'application/json')
        .set('authorization', userToken)
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message)
            .to.equal('No ratings on this page');
          done();
        });
    });
  });
  describe('POST /api/articles/:slug/ratings/', () => {
  /**
   * @description - POST (it should create a new rating for a specific article)
   */
    it('should create a new rating for a specific article', (done) => {
      chai.request(app)
        .post('/api/articles/how-to-train-your-dragon-2/ratings/')
        .set('authorization', `${userToken}`)
        .send({
          rating: 3,
        })
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('ratings');
          expect(res.body.ratings.articleId).to.equal(2);
          expect(res.body.ratings.rating).to.equal(3);
          done();
        });
    });
    /**
     * @description
     * POST (it should not create ratings for and article more than once by the same user)
     */
    it('should not create ratings for an article more than once by the same user', (done) => {
      chai.request(app)
        .post('/api/articles/how-to-train-your-dragon-2/ratings/')
        .set('authorization', `${userToken}`)
        .send({
          rating: 3,
        })
        .then((res) => {
          expect(res).to.have.status(409);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.have.property('message');
          expect(res.body.errors.message).to.equal('You already rated this article');
          done();
        });
    });
    /**
     * @description - POST (it should not create a new rating when the rating is not an integer)
     */
    it('should not create a new rating when the rating is not an integer', (done) => {
      chai.request(app)
        .post('/api/articles/how-to-train-your-dragon-2/ratings/')
        .set('authorization', `${userToken}`)
        .send({
          rating: 'life',
        })
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('errors');
          expect(res.body.errors.rating[0]).to.equal('The rating must be a number.');
          expect(res.body.errors.rating[1]).to.equal('The rating must be at least 1.');
          expect(res.body.errors.rating[2]).to.equal('The rating may not be greater than 5.');
          done();
        });
    });
    describe('PUT /api/articles/:slug/ratings/:ratingId', () => {
      /**
       * @description - PUT (it should update a specific users rating on an article)
       */
      it('should update a specific user rating on an article', (done) => {
        chai.request(app)
          .put('/api/articles/how-to-train-your-dragon-2/ratings/6')
          .set('authorization', `${userToken}`)
          .send({
            rating: 4,
          })
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('ratings');
            expect(res.body.ratings.articleId).to.equal(2);
            expect(res.body.ratings.rating).to.equal(4);
            done();
          });
      });
      /**
       * @description - PUT (it should not update another user rating on an article)
       */
      it('should not update another user rating on an article', (done) => {
        chai.request(app)
          .put('/api/articles/how-to-train-your-dragon-2/ratings/3')
          .set('authorization', `${userToken}`)
          .send({
            rating: 4,
          })
          .then((res) => {
            expect(res).to.have.status(403);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('errors');
            expect(res.body.errors.message).to.equal('Access denied.');
            done();
          });
      });
      /**
       * @description - PUT (it should not update a rating with an invalid rating ID)
       */
      it('should not update a rating with an invalid rating ID', (done) => {
        chai.request(app)
          .put('/api/articles/how-to-train-your-dragon-2/ratings/error')
          .set('authorization', `${userToken}`)
          .send({
            rating: 4,
          })
          .then((res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('errors');
            expect(res.body.errors.ratingId[0]).to.equal('The ratingId must be a number.');
            done();
          });
      });
    });
    describe('DELETE /api/articles/:slug/ratings/:ratingId', () => {
      /**
       * @description - Delete (it should not delete another users rating on an article)
       */
      it('should not delete another users rating on an article', (done) => {
        chai.request(app)
          .delete('/api/articles/how-to-train-your-dragon-2/ratings/3')
          .set('authorization', `${userToken}`)
          .then((res) => {
            expect(res).to.have.status(403);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('errors');
            expect(res.body.errors.message).to.equal('Access denied.');
            done();
          });
      });
      /**
       * @description - Delete (it should delete a specific rating by a user on an article)
       */
      it('should delete a specific rating by a user on an article', (done) => {
        chai.request(app)
          .delete('/api/articles/how-to-train-your-dragon-2/ratings/6')
          .set('authorization', `${userToken}`)
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.equal('Rating has been removed');
            done();
          });
      });
    });
  });
});
