export default (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    articleId: {
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.INTEGER
    },
    body: {
      type: DataTypes.STRING,
      required: true,
      trim: true,
      allowNull: false,
    }
  }, {});
  Comment.associate = (models) => {
    Comment.hasMany(models.CommentThread, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE'
    });
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
    });
    Comment.belongsTo(models.Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };
  return Comment;
};
