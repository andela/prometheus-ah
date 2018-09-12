module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('CommentLikes', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
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
    commentId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Comments',
        key: 'id',
        as: 'commentId'
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
  down: queryInterface => queryInterface.dropTable('CommentLikes')
};
