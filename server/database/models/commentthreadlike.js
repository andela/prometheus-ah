export default (sequelize, DataTypes) => {
  const CommentThreadLike = sequelize.define('CommentThreadLike', {
    userId: {
      type: DataTypes.INTEGER
    },
    commentThreadId: {
      type: DataTypes.INTEGER
    }
  }, {});
  CommentThreadLike.associate = (models) => {
    CommentThreadLike.belongsTo(models.CommentThread, {
      foreignKey: 'commentThreadId',
      onDelete: 'CASCADE',
    });
    CommentThreadLike.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      as: 'user',
    });
  };
  return CommentThreadLike;
};
