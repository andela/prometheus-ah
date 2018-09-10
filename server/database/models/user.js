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
    reset_password_hash: {
      type: DataTypes.STRING,
    },
    hash: {
      type: DataTypes.STRING,
    },
    socialLogin: {
      type: DataTypes.BOOLEAN
    },
    socialLoginType: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.STRING,
      isIn: {
        args: [['user', 'admin', 'superAdmin']],
        message: 'User role can only be user, admin or super admin',
      },
      defaultValue: 'user',
    },
    status: {
      type: DataTypes.STRING,
      isIn: {
        args: [['active', 'blocked']],
        message: 'User status can only be active or blocked',
      },
      defaultValue: 'active',
    },
    image: {
      type: DataTypes.STRING,
      defaultValue: 'https://bit.ly/2MKfwkO'
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      default: false
    }
  });

  User.prototype.toAuthJSON = function () {
    return {
      username: this.username,
      email: this.email,
      bio: this.bio,
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

    User.hasMany(models.CommentLike, {
      foreignKey: 'userId',
    });
    User.hasMany(models.Likes, {
      foreignKey: 'userId',
    });
  };

  return User;
};
