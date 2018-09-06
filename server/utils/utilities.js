import { Op } from 'sequelize';
import db from '../database/models';

const { User } = db;

/**
 * Class Utilities
 */
class Users {
  /**
   * find a user by username
   * @param {*} req - Request object
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {user} token - JWT token(Optional)
   */
  static findUserByUsername(req, res, next) {
    const { username: usernameParams } = req.params;
    User.find({
      where: {
        username: { [Op.eq]: usernameParams }
      }
    })
      .then((userProfileFound) => {
        if (!userProfileFound) {
          return res.status(404).json({
            message: 'Sorry, there is no user with that username'
          });
        }
        req.userFound = userProfileFound;
        return next();
      })
      .catch(next);
  }
}

export default Users;
