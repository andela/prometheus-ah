import comments from '../../utils/comments';

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Comments', [
    comments[0],
    comments[1],
    comments[2],
    comments[3]
  ]),

  down: queryInterface => queryInterface.bulkDelete('Comments', null, {})
};
