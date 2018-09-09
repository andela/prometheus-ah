module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define('Follow', {
    followId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
      }
    }
  }, {});
  Follow.associate = (models) => {
    // associations can be defined here
    Follow.belongsTo(models.User, {
      as: 'myFollowers',
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    Follow.belongsTo(models.User, {
      as: 'authorsIFollow',
      foreignKey: 'followId',
      onDelete: 'CASCADE',
    });
  };
  return Follow;
};
