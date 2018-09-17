module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Bookmarks', 'articleSlug', Sequelize.STRING);
    queryInterface.addColumn('Bookmarks', 'articleId', Sequelize.INTEGER);
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Bookmarks', 'articleSlug', Sequelize.STRING);
    queryInterface.removeColumn('Bookmarks', 'articleId', Sequelize.INTEGER);
  }
};
