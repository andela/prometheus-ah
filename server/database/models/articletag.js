module.exports = (sequelize, DataTypes) => {
  const ArticleTag = sequelize.define('ArticleTag', {
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {});
  ArticleTag.associate = (models) => {
    ArticleTag.belongsTo(models.Article, {
      foreignKey: 'articleId'
    });
    ArticleTag.belongsTo(models.Tag, {
      foreignKey: 'tagId'
    });
  };
  return ArticleTag;
};
