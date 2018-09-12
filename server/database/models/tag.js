module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    createdBy: {
      type: DataTypes.ENUM,
      values: ['ADMIN', 'USER'],
      defaultValue: 'USER',
    }
  }, {});
  Tag.associate = (models) => {
    Tag.belongsToMany(models.Article, {
      through: 'ArticleTag',
      foreignKey: 'tagId',
    });
  };
  return Tag;
};
