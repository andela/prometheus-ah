import categories from '../seed-data/reportCategories';

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('ReportCategories', [
    categories[0],
    categories[1]
  ]),
  down: queryInterface => queryInterface.bulkDelete('ReportCategories', null, {})
};
