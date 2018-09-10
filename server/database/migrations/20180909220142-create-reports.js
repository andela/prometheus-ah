module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Reports', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    categoryId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'ReportCategories',
        key: 'id',
        as: 'categoryId',
      },
    },
    userId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId',
      },
    },
    articleId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'Articles',
        key: 'id',
        as: 'articleId',
      },
    },
    details: {
      type: Sequelize.STRING,
      required: true,
      trim: true,
      allowNull: false
    },
    status: {
      type: Sequelize.STRING,
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

  down: queryInterface => queryInterface.dropTable('Reports'),
};
