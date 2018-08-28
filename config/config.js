var dotenv = require('dotenv');
dotenv.config();

var config = {
  development: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres'
  },
  test: {
    use_env_variable: 'TEST_DATABASE_URL',
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres'
  }
};

module.exports = config[process.env.NODE_ENV || 'development'];
