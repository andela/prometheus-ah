module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('CommentThreadLikes', {
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
    commentThreadId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'CommentThreads',
        key: 'id',
        as: 'commentThreadId'
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
  down: queryInterface => queryInterface.dropTable('CommentThreadLikes')
};
