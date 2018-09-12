import db from '../database/models';

const { User } = db;

/**
 * @class
 */
class AdminController {
  /**
   * Block a user.
   * @param {*} req - Request object
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} token - User object
   */
  static blockUser(req, res, next) {
    const { username } = req.params;

    User.findOne({
      where: {
        username
      }
    })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            message: 'User not found'
          });
        }
        if (user.role !== 'user') {
          return res.status(409).json({
            message: 'You are not allowed to block an admin'
          });
        } if (user.status === 'blocked') {
          return res.status(409).json({
            message: 'This user has already been blocked',
          });
        }
        user.update({
          status: 'blocked'
        });
        return res.status(200).json({
          message: 'User is successfully blocked',
          user: {
            username,
            email: user.email
          }
        });
      })
      .catch(next);
  }

  /**
   * unblock a blocked
   * @param {*} req - Request object
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} token - User object
   */
  static unBlockUser(req, res, next) {
    const { username } = req.params;

    User.findOne({
      where: {
        username
      }
    })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            message: 'User not found'
          });
        }
        if (user.status === 'active') {
          return res.status(409).json({
            message: 'This user is not blocked'
          });
        }
        user.update({
          status: 'active',
        });
        return res.status(200).json({
          message: 'User is successfully unblocked',
          user: {
            username,
            email: user.email
          }
        });
      })
      .catch(next);
  }

  /**
 * Get Blocked user
 * @param {*} req - Request object
 * @param {*} res - Response object
 * @param {*} next - Next function
 * @returns {object} token - User object
 */
  static getBlockedUsers(req, res, next) {
    const { page, limit, order } = req.query;
    const offset = parseInt((page - 1), 10) * limit;

    return User.findAndCountAll({
      where: { status: 'blocked' },
      order: [
        ['createdAt', order]
      ],
      attributes: ['username', 'email', 'firstname', 'lastname', 'bio'],
      offset,
      limit,
    })
      .then((blockedUsers) => {
        const { count } = blockedUsers;
        const pageCount = Math.ceil(count / limit);
        return res.status(200).json({
          paginationMeta: {
            pageCount,
            totalCount: count,
            outputCount: blockedUsers.rows.length,
            pageSize: limit,
            currentPage: page,
          },
          blockedUsers: blockedUsers.rows,
        });
      })
      .catch(next);
  }

  /**
 * Update a user to admin
 * @param {*} req - Request object
 * @param {*} res - Response object
 * @param {*} next - Next function
 * @returns {object} token - User object
 */
  static createAdmin(req, res, next) {
    const { username } = req.params;

    User.findOne({
      where: {
        username
      }
    })
      .then((user) => {
        if (!user) {
          res.status(404).json({
            message: 'User not found'
          });
        }
        if (user.role === 'admin') {
          return res.status(409).json({
            message: 'This user is already an admin'
          });
        }
        if (user.status === 'blocked') {
          return res.status(400).json({
            message: 'This user has been blocked, unblock before updating role to admin',
          });
        }
        user.update({
          role: 'admin'
        });
        return res.status(200).json({
          message: 'User successfully ugraded to admin',
          user: {
            username,
            email: user.email
          }
        });
      })
      .catch(next);
  }

  /**
 * Update a user to admin
 * @param {*} req - Request object
 * @param {*} res - Response object
 * @param {*} next - Next function
 * @returns {object} token - User object
 */
  static removeAdmin(req, res, next) {
    const { username } = req.params;

    User.findOne({
      where: {
        username
      }
    })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            message: 'User not found'
          });
        }
        if (user.role === 'superAdmin') {
          return res.status(409).json({
            message: 'You cannot block and remove a super admin'
          });
        }
        if (user.role === 'user') {
          return res.status(409).json({
            message: 'This user is not an admin',
          });
        }
        user.update({
          role: 'user',
          status: 'blocked'
        });
        return res.status(200).json({
          message: 'You have removed the admin privileges and successfully blocked this user',
          user: {
            username,
            email: user.email
          }
        });
      })
      .catch(next);
  }
}

export default AdminController;
