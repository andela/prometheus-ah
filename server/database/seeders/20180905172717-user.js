import users from '../../utils/users';

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Users', [
    users[0],
    users[1]
  ]),
  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
