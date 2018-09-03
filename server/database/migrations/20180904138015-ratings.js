module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Ratings', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    userId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId',
      },
    },
    articleId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Articles',
        key: 'id',
        as: 'articleId',
      },
    },
    rating: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: { min: 1, max: 5 }
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
  }),
  down: queryInterface => queryInterface.dropTable('Ratings')
};
