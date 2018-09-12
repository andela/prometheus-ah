import commentThread from '../seed-data/commentThreads';

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('CommentThreads', [
    commentThread[0],
    commentThread[1],
    commentThread[2],
    commentThread[3]
  ]),

  down: queryInterface => queryInterface.bulkDelete('CommentThreads', null, {})
};
