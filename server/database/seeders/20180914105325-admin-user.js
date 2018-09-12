import admins from '../seed-data/admins';

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Users', [
    admins[0],
  ]),
  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
