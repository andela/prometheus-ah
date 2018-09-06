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
    },
    image: {
      type: DataTypes.STRING,
      defaultValue: 'https://bit.ly/2MKfwkO'
    }
  });
  /**
   * Hook for hashing password before creating new user
   */
  User.hook('beforeCreate', (newUser) => {
    newUser.password = bcrypt.hashSync(newUser.password, bcrypt.genSaltSync(8));
  });

  User.prototype.toAuthJSON = function () {
    return {
      username: this.username,
      email: this.email,
      bio: this.bio
    };
  };

  User.associate = (models) => {
    User.hasMany(models.Article, {
      foreignKey: 'userId'
    });
  };

  return User;
};
