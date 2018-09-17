export default (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    articleId: {
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.INTEGER
    },
    highlightedText: {
      type: DataTypes.STRING,
      required: false,
      trim: true,
      allowNull: true,
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
    Comment.hasMany(models.CommentLike, {
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
