module.exports = (sequelize, DataTypes) => {
  const ReportCategory = sequelize.define('ReportCategory', {
    title: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  return ReportCategory;
};
