import follows from '../seed-data/follows';

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Follows', [
    follows[0],
    follows[1],
    follows[2],
    follows[3],
    follows[4],
  ]),
  down: queryInterface => queryInterface.bulkDelete('Follows', null, {})
};
