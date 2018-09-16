module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('ReadViews', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    articleId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Articles',
        key: 'id',
        as: 'articleId'
      }
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId'
      }
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('ReadViews')
};
