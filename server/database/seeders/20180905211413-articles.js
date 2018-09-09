import articles from '../../utils/articles';

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Articles', [
    articles[0],
    articles[1],
    articles[2],
  ]),
  down: queryInterface => queryInterface.bulkDelete('Articles', null, {})
};
