const bcrypt = require('bcrypt');

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Users', [
    {
      username: 'joeeasy',
      email: 'joeeasy@gmail.com',
      password: bcrypt.hashSync('123456', bcrypt.genSaltSync(8)),
      createdAt: '2016-02-18T03:22:56.637Z',
      updatedAt: '2016-02-18T03:48:35.824Z',
    },
    {
      username: 'faksam',
      email: 'fakunlesamuel@gmail.com',
      password: bcrypt.hashSync('123456', bcrypt.genSaltSync(8)),
      createdAt: '2016-02-18T03:22:56.637Z',
      updatedAt: '2016-02-18T03:48:35.824Z',
    }
  ]),
  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
