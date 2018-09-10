module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    details: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING
    },
  });
  Report.associate = (models) => {
    Report.belongsTo(models.User, {
      foreignKey: 'userId',
      allowNull: false,
    });
    Report.belongsTo(models.Article, {
      foreignKey: 'articleId',
      allowNull: false,
    });
    Report.belongsTo(models.ReportCategory, {
      foreignKey: 'categoryId',
      allowNull: false,
    });
  };

  return Report;
};
