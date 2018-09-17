import db from '../database/models';

const { User, Follow } = db;
/**
 * Class representing FollowController
 */
class FollowController {
  /**
   * Handles the Follow Feature
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {*} next - Next function
   * @returns {object} An object containing all the data related to the followed user
   */
  static followUser(req, res, next) {
    const { username } = req.params;
    User.find({
      where: {
        username
      }
    }).then((user) => {
      if (user) {
        const follow = user;
        const { userId } = req.decoded;
        if (userId !== follow.id) {
          Follow.findOrCreate({
            where: {
              userId,
              followId: follow.id
            }
          }).spread((check, created) => {
            if (!created) {
              return res.status(409).json({
                message: `You are already following ${username}`
              });
            }
            res.status(200).json({
              message: `You are now following ${username}`
            });
          });
        } else {
          return res.status(409).json({
            message: 'You cannot follow yourself'
          });
        }
      } else {
        return res.status(404).json({
          message: 'User not found'
        });
      }
    }).catch(next);
  }

  /**
   * @function unfollow
   * @summary Handles the unfollow feature
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {*} next - Incase of errors
   * @returns {object} An object containing all the data related to the unfollowed user
   */
  static unfollowUser(req, res, next) {
    const { username } = req.params;
    User.find({
      where: {
        username
      }
    }).then((user) => {
      if (user) {
        const follow = user;
        const { userId } = req.decoded;
        Follow.destroy({
          where: {
            userId,
            followId: follow.id
          }
        }).then((unfollow) => {
          if (unfollow) {
            res.status(200).json({
              message: `You have Unfollowed ${username}`
            });
          } else {
            res.status(404).json({
              message: `You never followed ${username}`
            });
          }
        }).catch(next);
      }
    });
  }

  /**
     * @function getAllUserIFollow
     * @summary Handles getting all users a logged in user is following
     * @param {object} req - Request object
     * @param {object} res - Response object
     * @param {*} next - Incase of errors
     * @returns {Array} An array of object containing required user data
     */
  static getAllUserIFollow(req, res, next) {
    const { username } = req.params;
    const page = parseInt((req.query.page || 1), 10);
    const limit = parseInt((req.query.limit || 10), 10);
    const offset = parseInt((page - 1), 10) * limit;
    User.find({
      where: {
        username
      },
    }).then((foundUser) => {
      if (foundUser) {
        const { userId } = req.decoded;
        Follow.findAndCountAll({
          where: {
            userId
          },
          include: [
            {
              model: User,
              as: 'authorsIFollow',
              attributes: ['id', 'email', 'username']
            }
          ],
          attributes: {
            exclude: [
              'id',
              'userId',
              'followId',
              'createdAt',
              'updatedAt'
            ],
          },
          offset,
          limit,
        })
          .then((user) => {
            const pageCount = Math.ceil(user.count / limit);
            if (user.rows.length === 0) {
              return res.status(200).json({
                message: 'You are yet to follow an Author.'
              });
            }
            const authorsIFollowList = user.rows.map(follow => follow.authorsIFollow);
            res.status(200).json({
              paginationMeta: {
                pageCount,
                totalCount: user.count,
                outputCount: user.rows.length,
                pageSize: limit,
                currentPage: page
              },
              myTotalFollow: user.count,
              authorsIFollow: authorsIFollowList
            });
          }).catch(next);
      } else {
        return res.status(404).json({
          message: 'User not found.'
        });
      }
    });
  }

  /**
   * @function getAllMyFollowers
   * @summary Handles getting all logged in user's followers
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {*} next - Incase of errors
   * @returns {Array} An array of object containing required user data
   */
  static getAllMyFollowers(req, res, next) {
    const { username } = req.params;
    const page = parseInt((req.query.page || 1), 10);
    const limit = parseInt((req.query.limit || 10), 10);
    const offset = parseInt((page - 1), 10) * limit;
    User.find({
      where: {
        username
      }
    }).then((foundUser) => {
      if (foundUser) {
        const { userId } = req.decoded;
        Follow.findAndCountAll({
          where: {
            followId: userId,
          },
          include: [
            {
              model: User,
              as: 'myFollowers',
              attributes: ['id', 'email', 'username']
            }
          ],
          attributes: {
            exclude: [
              'id',
              'userId',
              'followId',
              'createdAt',
              'updatedAt'
            ]
          },
          offset,
          limit,
        }).then((user) => {
          const pageCount = Math.ceil(user.count / limit);
          if (user.rows.length === 0) {
            return res.status(200).json({
              message: 'You are yet to have followers.'
            });
          }
          const myFollowersList = user.rows.map(follower => follower.myFollowers);
          res.status(200).json({
            paginationMeta: {
              pageCount,
              totalCount: user.count,
              outputCount: user.rows.length,
              pageSize: limit,
              currentPage: page
            },
            totalFollower: user.count,
            myFollowers: myFollowersList
          });
        }).catch(next);
      } else {
        return res.status(404).json({
          message: 'User not found.'
        });
      }
    });
  }
}
export default FollowController;
