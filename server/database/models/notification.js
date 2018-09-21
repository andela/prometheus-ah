export default (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    articleSlug: {
      type: DataTypes.STRING,
      allowNull: false
    },
    commentId: {
      type: DataTypes.INTEGER,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'unread',
      allowNull: false
    }
  }, {});
  Notification.associate = () => {
    // associations can be defined here
  };
  return Notification;
};
