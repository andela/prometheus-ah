const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'Empty strings not allowed' }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Enter a Valid Email' },
      }
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: { msg: 'Empty strings not allowed' }
      }
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: { msg: 'Empty strings not allowed' }
      }
    },
    bio: {
      type: DataTypes.TEXT,
    },
    password: {
      type: DataTypes.STRING,
    },
    socialLoginType: {
      type: DataTypes.STRING
    }
  });
  /**
   * Hook for hashing passeord before creating new user
   */

  User.prototype.toAuthJSON = function () {
    return {
      username: this.username,
      email: this.email,
      bio: this.bio
    };
  };

  User.associate = (models) => {
    User.hasMany(models.Article, {
      foreignKey: 'userId',
    });

    User.hasMany(models.Comment, {
      foreignKey: 'userId',
    });

    User.hasMany(models.CommentThread, {
      foreignKey: 'userId',
    });
  };

  return User;
};
