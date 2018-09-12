import articleTags from '../seed-data/articleTags';

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('ArticleTags', [
    articleTags[0],
    articleTags[1],
    articleTags[2],
    articleTags[3],
    articleTags[4],
    articleTags[5],
  ]),

  down: queryInterface => queryInterface.bulkDelete('ArticleTags', null, {})
};
