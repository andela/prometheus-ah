import db from '../database/models';

const { User } = db;

/**
 * Class representing users
 */
class UserController {
  /**
   * Get all users profile
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} user - User object
   */
  static getAllUserProfile(req, res, next) {
    const page = parseInt((req.query.page || 1), 10);
    const limit = parseInt((req.query.limit || 10), 10);
    const offset = parseInt((page - 1), 10) * limit;
    let order = req.query.order || 'ASC';
    order = order.toUpperCase();

    if (order !== 'ASC' && order !== 'DESC') {
      return res.status(400).json({
        message: 'order can only be ASC or DESC'
      });
    }

    User.findAndCountAll({
      order: [
        ['createdAt', order]
      ],
      attributes: ['username', 'email', 'firstname', 'lastname', 'bio'],
      offset,
      limit,
    })
      .then((users) => {
        const { count } = users;
        const pageCount = Math.ceil(count / limit);
        if (users.rows.length === 0) {
          return res.status(200).json({
            message: 'No user on this page',
            users: users.rows,
          });
        }
        return res.status(200).json({
          message: 'Users profile successfully retrieved',
          paginationMeta: {
            pageCount,
            totalCount: count,
            outputCount: users.rows.length,
            pageSize: limit,
            currentPage: page,
          },
          users: users.rows,
        });
      })
      .catch(next);
  }

  /**
   * Get a users profile
   * @param {*} req - Request object
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {profile} token - JWT token(Optional)
   */
  static getProfileByUsername(req, res) {
    const {
      id, email, username, firstname, lastname, bio, image
    } = req.userFound;
    const profileFound = {
      id, email, username, firstname, lastname, bio, image
    };
    return res.status(200).json({
      message: 'Profile successfully retrieved',
      profile: profileFound
    });
  }

  /**
   * Edit a user's profile
   * @param {*} req - Request object
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {profile} token - JWT token
   */
  static editProfile(req, res, next) {
    const { decoded, userFound } = req;
    if (userFound.id !== decoded.userId) {
      return res.status(403).json({
        message: 'Access denied.'
      });
    }
    const {
      email: Email, bio: Bio, image: Image, firstname: Firstname, lastname: Lastname
    } = req.body.user;
    userFound.update({
      email: Email || userFound.email,
      bio: Bio || userFound.bio,
      image: Image || userFound.image,
      firstname: Firstname || userFound.firstname,
      lastname: Lastname || userFound.lastname
    })
      .then((updatedProfile) => {
        const {
          id, email, username, firstname, lastname, bio, image
        } = updatedProfile;
        const profileUpdate = {
          id, email, username, firstname, lastname, bio, image
        };
        res.status(200).json({
          message: 'Profile successfully updated',
          profile: profileUpdate
        });
      })
      .catch(next);
  }
}

export default UserController;
