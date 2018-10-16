import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import userFaker from './helpers/userFakeData';
import admins from '../database/seed-data/admins';

chai.use(chaiHttp);

let userToken;

describe('Tests API endpoint for report categories', () => {
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

  describe('Tests Reports API endpoint for Admin', () => {
    /**
     *
     * @description - GET (it should return all report categories)
     */
    it('should return all report categories', (done) => {
      chai.request(app)
        .get('/api/reportCategories')
        .set('authorization', userToken)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('reportCategories');
          expect(res.body.reportCategories[0].id).to.equal(1);
          expect(res.body.reportCategories[0].title)
            .to.equal('Plagiarised');
          expect(res.body.reportCategories[0].description)
            .to.equal('Plagiarism content from this link');
          done();
        });
    });
    /**
     * @description - Delete (it should return an authorization error when user is not an Admin)
     */
    it('should return an authorization error when user is not an Admin', (done) => {
      chai.request(app)
        .delete('/api/reportCategories/2')
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
  describe('POST /api/reportCategories/', () => {
    /**
     * @description - POST (it should not create a duplicate report category)
     */
    it('should not create a duplicate report category', (done) => {
      chai.request(app)
        .post('/api/reportCategories/')
        .set('authorization', `${userToken}`)
        .send({
          title: 'Plagiarised',
          description: 'Plagiarism content from this link',
        })
        .then((res) => {
          expect(res).to.have.status(409);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message)
            .to.equal('This report category already exist.');
          done();
        });
    });
    /**
     * @description - POST (it should create a new report category)
     */
    it('should create a new report category', (done) => {
      chai.request(app)
        .post('/api/reportCategories/')
        .set('authorization', `${userToken}`)
        .send({
          title: 'Plagiarised Article',
          description: 'Plagiarism of article content from this link',
        })
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('reportCategory');
          expect(res.body.reportCategory.title)
            .to.equal('Plagiarised Article');
          expect(res.body.reportCategory.description)
            .to.equal('Plagiarism of article content from this link');
          done();
        });
    });
    /**
     * @description - POST (it should not create a report category when input body is empty)
     */
    it('should not create a report category when input body is empty', (done) => {
      chai.request(app)
        .post('/api/reportCategories')
        .set('authorization', `${userToken}`)
        .send({})
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('errors');
          expect(res.body.errors.title[0]).to.equal('The title field is required.');
          expect(res.body.errors.description[0]).to.equal('The description field is required.');
          done();
        });
    });
    /**
     * @description - POST (it should not create a report category with invalid input)
     */
    it('should not create a report category with invalid input', (done) => {
      chai.request(app)
        .post('/api/reportCategories')
        .set('authorization', `${userToken}`)
        .send({
          title: 'Life',
          description: 'Life is'
        })
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('errors');
          expect(res.body.errors.title[0])
            .to.equal('The title is too short. Min length is 5 characters.');
          expect(res.body.errors.description[0])
            .to.equal('The description is too short. Min length is 10 characters.');
          done();
        });
    });
  });
  describe('GET /api/reportCategories', () => {
    /**
     * @description - GET (it should return all report categories)
     */
    it('should return all report categories', (done) => {
      chai.request(app)
        .get('/api/reportCategories')
        .set('authorization', userToken)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('reportCategories');
          expect(res.body.reportCategories[0].id).to.equal(1);
          expect(res.body.reportCategories[0].title)
            .to.equal('Plagiarised');
          expect(res.body.reportCategories[0].description)
            .to.equal('Plagiarism content from this link');
          done();
        });
    });
    /**
     * @description - GET - (it should return a specific report category)
     */
    it('should return a specific report category', (done) => {
      chai.request(app)
        .get('/api/reportCategories/2')
        .set('Content-Type', 'application/json')
        .set('authorization', userToken)
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('reportCategory');
          expect(res.body.reportCategory.title).to.equal('Violate terms of agreement');
          expect(res.body.reportCategory.description)
            .to.equal('Violates terms of agreement in section 2.7');
          done();
        });
    });
    /**
     * @description - GET - (it should return an error when report is not found)
     */
    it('should return an error when report is not found', (done) => {
      chai.request(app)
        .get('/api/reportCategories/95')
        .set('Content-Type', 'application/json')
        .set('authorization', userToken)
        .then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message)
            .to.equal('Report category not found');
          done();
        });
    });
  });
  describe('PUT /api/reportCategories/:id', () => {
    /**
     * @description - PUT (it should of a specific report category when fields are empty)
     */
    it('should not update a specific report category when fields are empty', (done) => {
      chai.request(app)
        .put('/api/reportCategories/2')
        .set('authorization', `${userToken}`)
        .send({
          title: '',
          description: ''
        })
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('errors');
          expect(res.body.errors.title[0]).to.equal('The title field is required.');
          expect(res.body.errors.description[0])
            .to.equal('The description field is required.');
          done();
        });
    });
    /**
     * @description - PUT (it should a specific report category)
     */
    it('should update a specific report category', (done) => {
      chai.request(app)
        .put('/api/reportCategories/2')
        .set('authorization', `${userToken}`)
        .send({
          title: 'Copyright Violations',
          description: 'Colloquially referred to as piracy.'
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('reportCategory');
          expect(res.body.reportCategory.title).to.equal('Copyright Violations');
          expect(res.body.reportCategory.description)
            .to.equal('Colloquially referred to as piracy.');
          done();
        });
    });
    /**
     * @description - PUT (it should not update a report category with an invalid report ID)
     */
    it('should not update a report category with an invalid report ID', (done) => {
      chai.request(app)
        .put('/api/reportCategories/error')
        .set('authorization', `${userToken}`)
        .send({
          categoryId: 'Plagiarised Update',
          details: 'This article is an infringement, a word for word copy (Update)',
        })
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.equal('The id must be an integer.');
          done();
        });
    });
    /**
     * @description - PUT (it should not update a report category that does not exist)
     */
    it('should not update a report category that does not exist', (done) => {
      chai.request(app)
        .put('/api/reportCategories/69')
        .set('authorization', `${userToken}`)
        .send({
          title: 'Plagiarised Update',
          description: 'This article is an infringement, a word for word copy (Update)',
        })
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Report category was not found.');
          done();
        });
    });
  });
  describe('DELETE reports/:id', () => {
    /**
     * @description - Delete (it should delete a specific report category)
     */
    it('should delete a specific report category', (done) => {
      chai.request(app)
        .delete('/api/reportCategories/2')
        .set('authorization', `${userToken}`)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Report category has been deleted');
          done();
        });
    });
    /**
     * @description - Delete (it should return an error when report category is not found)
     */
    it('should return an error when report category is not found', (done) => {
      chai.request(app)
        .delete('/api/reportCategories/50')
        .set('authorization', `${userToken}`)
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Report category not found');
          done();
        });
    });
  });
});
