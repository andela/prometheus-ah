module.exports = (sequelize, DataTypes) => {
  const Likes = sequelize.define('Likes', {
    userId: {
      type: DataTypes.INTEGER,
    },
    articleId: {
      type: DataTypes.INTEGER,
    },
    likeStatus: {
      type: DataTypes.BOOLEAN,
    }
  });

  Likes.associate = (models) => {
    Likes.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Likes.belongsTo(models.Article, {
      foreignKey: 'articleId',
    });
  };

  return Likes;
};
