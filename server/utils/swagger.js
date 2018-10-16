import swaggerJSDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

// Swagger definition
const swaggerDefinition = {
  info: {
    title: 'REST API for Authors Haven',
    version: '1.0.0',
    description: 'This is the REST API for Authors Haven',
  },
  host: process.env.DOC_HOST,
  basePath: '/api',
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: [
    './server/docs/swagger/swagger.yaml',
    './server/docs/swagger/profile.yaml',
    './server/docs/swagger/bookmark.yaml',
    './server/docs/swagger/articles.yaml',
    './server/docs/swagger/comment.yaml',
    './server/docs/swagger/commentThread.yaml',
    './server/docs/swagger/rating.yaml',
    './server/docs/swagger/follow.yaml',
    './server/docs/swagger/commentLike.yaml',
    './server/docs/swagger/commentThreadLike.yaml',
    './server/docs/swagger/admin.yaml',
    './server/docs/swagger/report.yaml',
    './server/docs/swagger/likes.yaml',
    './server/docs/swagger/reportCategory.yaml',
  ]
};
// initialize swagger-jsdoc
export default swaggerJSDoc(options);
