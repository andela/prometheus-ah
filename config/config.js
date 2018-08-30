var dotenv = require('dotenv');
dotenv.config();

var config = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DEV_NAME,
    host: process.env.DB_HOSTNAME,
    port: 5432,
    dialect: 'postgres'
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_TEST_NAME,
    host: process.env.DB_HOSTNAME,
    port: 5432,
    dialect: 'postgres'
  },
  production: {
    use_env_variable: process.env.configEnvVar,
    dialect: process.env.dialect
  }
};

module.exports = config[process.env.NODE_ENV || 'development'];
