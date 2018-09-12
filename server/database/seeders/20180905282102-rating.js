import ratings from '../seed-data/ratings';

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Ratings', [
    ratings[0],
    ratings[1],
    ratings[2],
    ratings[3],
    ratings[4],
  ]),
  down: queryInterface => queryInterface.bulkDelete('Ratings', null, {})
};
