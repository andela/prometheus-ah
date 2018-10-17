module.exports = (sequelize, DataTypes) => {
  const ReadView = sequelize.define('ReadView', {
    userId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
      }
    },
    articleId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Article',
        key: 'id',
      }
    }
  }, {});

  ReadView.associate = (models) => {
    ReadView.belongsTo(models.Article, {
      onDelete: 'CASCADE',
      foreignKey: 'articleId',
    });

    ReadView.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: 'userId',
    });
  };
  return ReadView;
};
