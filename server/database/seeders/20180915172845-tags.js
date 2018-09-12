import tags from '../seed-data/tags';

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Tags', [
    tags[0],
    tags[1],
    tags[2],
    tags[3],
    tags[4],
    tags[5],
  ]),

  down: queryInterface => queryInterface.bulkDelete('Tags', null, {})
};
