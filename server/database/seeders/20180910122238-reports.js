import reports from '../seed-data/reports';

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Reports', [
    reports[0],
    reports[1],
    reports[2],
    reports[3]
  ]),
  down: queryInterface => queryInterface.bulkDelete('Reports', null, {})
};
