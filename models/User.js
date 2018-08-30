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
    bio: {
      type: DataTypes.TEXT,
    },
    image: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
  });
  /**
   * Hook for hashing passeord before creating new user
   */
  User.hook('beforeCreate', (newUser) => {
    newUser.password = bcrypt.hashSync(newUser.password, bcrypt.genSaltSync(8));
  });

  User.prototype.toAuthJSON = function () {
    return {
      username: this.username,
      email: this.email,
      image: this.image,
      bio: this.bio
    };
  };

  return User;
};
