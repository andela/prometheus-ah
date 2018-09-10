import SequelizeSlugify from 'sequelize-slugify';

module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    slug: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
    },
    body: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.STRING,
    },
    readingTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {});

  SequelizeSlugify.slugifyModel(Article, {
    source: ['title'],
    slugOptions: { lower: true },
    overwrite: false,
    column: 'slug'
  });

  Article.associate = (models) => {
    Article.belongsTo(models.User, {
      foreignKey: 'userId',
    });

    Article.hasMany(models.Comment, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });

    Article.belongsToMany(models.Tag, {
      through: 'ArticleTag',
      foreignKey: 'articleId'
    });
    Article.hasMany(models.Likes, {
      foreignKey: 'articleId',
    });
  };

  return Article;
};
