import users from '../seed-data/users';
import admins from '../seed-data/admins';

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Users', [
    users[0],
    users[1],
    users[3],
    users[4],
    users[8],
    users[9],
    admins[1],
    admins[2],
    admins[3],
    admins[4],
    admins[5],
    admins[6],
  ]),
  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
