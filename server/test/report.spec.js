import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import userFaker from './helpers/userFakeData';
import admins from '../database/seed-data/admins';

chai.use(chaiHttp);

let userToken;

describe('Tests API endpoint to report articles', () => {
  /**
   * @description - POST (it should login a valid user)
  */
  before((done) => {
    const { username, password } = userFaker.validUserDetails;
    chai.request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send({
        user: { username, password }
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Welcome User you are now logged in.');
        userToken = res.body.user.token;
        done();
      });
  });
  describe('POST /api/articles/:slug/reports/', () => {
    /**
     * @description - POST (it should create a new report for a specific article)
     */
    it('should create a new report for a specific article', (done) => {
      chai.request(app)
        .post('/api/articles/how-to-train-your-dragon-2/reports/')
        .set('authorization', `${userToken}`)
        .send({
          categoryId: 1,
          details: 'This article is an infringement, a word for word copy',
        })
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('report');
          expect(res.body.report.categoryId).to.equal(1);
          expect(res.body.report.details)
            .to.equal('This article is an infringement, a word for word copy');
          done();
        });
    });
    /**
     * @description - POST (it should return an error when category is not found)
     */
    it('should return an error when category is not found', (done) => {
      chai.request(app)
        .post('/api/articles/how-to-train-your-dragon-2/reports/')
        .set('authorization', `${userToken}`)
        .send({
          categoryId: 100,
          details: 'This article is an infringement, a word for word copy',
        })
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.have.property('message');
          expect(res.body.errors.message)
            .to.equal('Category not found');
          done();
        });
    });
    /**
     * @description - POST (it should not create a new report categoryId or details field is empty)
     */
    it('should not create a new report categoryId or details field is empty', (done) => {
      chai.request(app)
        .post('/api/articles/how-to-train-your-dragon-2/reports/')
        .set('authorization', `${userToken}`)
        .send({})
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('errors');
          expect(res.body.errors.categoryId[0]).to.equal('The categoryId field is required.');
          expect(res.body.errors.details[0]).to.equal('The details field is required.');
          done();
        });
    });
    /**
     * @description
     * POST (it should not create ratings for an invalid article)
     */
    it(
      'should not create report for an invalid article',
      (done) => {
        chai.request(app)
          .post('/api/articles/how-to-train-your-dragon2/reports/')
          .set('authorization', `${userToken}`)
          .send({
            categoryId: 1,
            details: 'This article is an infringement, a word for word copy',
          })
          .then((res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('errors');
            expect(res.body.errors).to.have.property('message');
            expect(res.body.errors.message).to.equal('Article not found');
            done();
          });
      }
    );
  });
  describe('Tests Reports API endpoint for Admin', () => {
    /**
     *
     * @description - GET (it should return an authorization error when user is not an Admin)
     */
    it('should return an authorization error when user is not an Admin', (done) => {
      chai.request(app)
        .get('/api/reports')
        .set('authorization', userToken)
        .then((res) => {
          expect(res).to.have.status(403);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message)
            .to.equal('Access denied');
          done();
        });
    });
    /**
     * @description - GET (it should return  an authorization error when user is not an Admin)
     */
    it('should return an authorization error when user is not an Admin', (done) => {
      chai.request(app)
        .get('/api/reports')
        .set('authorization', userToken)
        .then((res) => {
          expect(res).to.have.status(403);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message)
            .to.equal('Access denied');
          done();
        });
    });
    /**
     * @description - Delete (it should return an authorization error when user is not an Admin)
     */
    it('should return an authorization error when user is not an Admin', (done) => {
      chai.request(app)
        .delete('/api/reports/5')
        .set('authorization', `${userToken}`)
        .then((res) => {
          expect(res).to.have.status(403);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message)
            .to.equal('Access denied');
          done();
        });
    });
    /**
     * @description - POST (it should login super admin)
     */
    it('should login super admin', (done) => {
      chai.request(app)
        .post('/api/users/login')
        .set('Content-Type', 'application/json')
        .send({
          user: {
            username: admins[0].username,
            password: admins[7].password1
          }
        })
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Welcome User you are now logged in.');
          userToken = res.body.user.token;
          done();
        });
    });
  });
  describe('GET /api/reports', () => {
    /**
     * @description - GET (it should return all reports)
     */
    it('should return all reports', (done) => {
      chai.request(app)
        .get('/api/reports?order=whe')
        .set('authorization', userToken)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('reports');
          expect(res.body.reports[0].categoryId).to.equal(1);
          expect(res.body.reports[0].details)
            .to.equal('This article is an infringement, a word for word copy');
          done();
        });
    });
    /**
     * @description - GET - (it should return a specific report)
     */
    it('should return a specific report', (done) => {
      chai.request(app)
        .get('/api/reports/5')
        .set('Content-Type', 'application/json')
        .set('authorization', userToken)
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('report');
          expect(res.body.report.category).to.equal('Plagiarised');
          expect(res.body.report.status).to.equal('Open');
          expect(res.body.report.details)
            .to.equal('This article is an infringement, a word for word copy');
          done();
        });
    });
    /**
     * @description - GET - (it should return an error when report is not found)
     */
    it('should return an error when report is not found', (done) => {
      chai.request(app)
        .get('/api/reports/95')
        .set('Content-Type', 'application/json')
        .set('authorization', userToken)
        .then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors.message)
            .to.equal('Report not found');
          done();
        });
    });
  });
  describe('PUT /api/reports/:reportId', () => {
    /**
     * @description - PUT (it should update the status of a specific report)
     */
    it('should update the status of a specific report', (done) => {
      chai.request(app)
        .put('/api/reports/5')
        .set('authorization', `${userToken}`)
        .send({
          status: 'Closed'
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('reports');
          expect(res.body.reports.status).to.equal('Closed');
          done();
        });
    });
    /**
     * @description - PUT (it should not update a report with an invalid report ID)
     */
    it('should not update a report with an invalid report ID', (done) => {
      chai.request(app)
        .put('/api/reports/error')
        .set('authorization', `${userToken}`)
        .send({
          categoryId: 'Plagiarised Update',
          details: 'This article is an infringement, a word for word copy (Update)',
        })
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.equal('The reportId must be an integer.');
          done();
        });
    });
  });
  describe('DELETE reports/:reportId', () => {
    /**
     * @description - Delete (it should delete a specific report)
     */
    it('should delete a specific report', (done) => {
      chai.request(app)
        .delete('/api/reports/5')
        .set('authorization', `${userToken}`)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Report has been deleted');
          done();
        });
    });
    /**
     * @description - Delete (it should return an error when report is not found)
     */
    it('should return an error when report is not found', (done) => {
      chai.request(app)
        .delete('/api/reports/50')
        .set('authorization', `${userToken}`)
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('errors');
          expect(res.body.errors.message).to.equal('Report not found');
          done();
        });
    });
  });
});
