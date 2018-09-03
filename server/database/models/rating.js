import { DataTypes } from 'sequelize';

module.exports = (sequelize) => {
  const Rating = sequelize.define('Rating', {
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });
  Rating.associate = (models) => {
    Rating.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASECADE',
      allowNull: false,
    });
    Rating.belongsTo(models.Article, {
      foreignKey: 'articleId',
      onDelete: 'CASECADE',
      allowNull: false,
    });
  };
  return Rating;
};
