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
  apis: ['./server/docs/swagger/**/*.yaml'],
};
// initialize swagger-jsdoc
export default swaggerJSDoc(options);
