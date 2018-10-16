module.exports = (sequelize, DataTypes) => {
  const ReportCategory = sequelize.define('ReportCategory', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    deletedAt: {
      type: DataTypes.DATE
    }
  }, {
    paranoid: true
  });
  ReportCategory.associate = (models) => {
    ReportCategory.hasMany(models.Report, {
      foreignKey: 'categoryId',
    });
  };
  return ReportCategory;
};
