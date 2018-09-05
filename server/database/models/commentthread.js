export default (sequelize, DataTypes) => {
  const CommentThread = sequelize.define('CommentThread', {
    userId: {
      type: DataTypes.INTEGER,
    },
    commentId: {
      type: DataTypes.INTEGER,
    },
    body: {
      type: DataTypes.STRING,
      required: true,
      trim: true,
      allowNull: false,
    }
  }, {});
  CommentThread.associate = (models) => {
    CommentThread.belongsTo(models.Comment, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE'
    });

    CommentThread.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  };
  return CommentThread;
};
