const bcrypt = require('bcrypt');

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Users', [
    {
      username: 'steven',
      email: 'stevenomobo@gmail.com',
      password: bcrypt.hashSync('mypassword', bcrypt.genSaltSync(8)),
      createdAt: '2016-02-18T03:22:56.637Z',
      updatedAt: '2016-02-18T03:48:35.824Z',
    },
    {
      username: 'steven1',
      email: 'stevenomobo1@gmail.com',
      password: bcrypt.hashSync('mypassword', bcrypt.genSaltSync(8)),
      createdAt: '2016-02-18T03:22:56.637Z',
      updatedAt: '2016-02-18T03:48:35.824Z',
    },
  ]),

  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
