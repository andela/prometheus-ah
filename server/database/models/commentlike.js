export default(sequelize, DataTypes) => {
  const CommentLike = sequelize.define('CommentLike', {
    userId: {
      type: DataTypes.INTEGER,
    },
    commentId: {
      type: DataTypes.INTEGER
    }
  }, {});
  CommentLike.associate = (models) => {
    CommentLike.belongsTo(models.Comment, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE',
    });
    CommentLike.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      as: 'user'
    });
  };
  return CommentLike;
};
