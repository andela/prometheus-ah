import { Op } from 'sequelize';
import db from '../database/models';
import { cloudinaryConfig, uploader } from '../database/config/cloudinary';
import { multerUploads, dataUri } from '../database/config/multerConfig';

const { User, Article } = db;

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
    const { page, limit, order } = req.query;
    const offset = parseInt((page - 1), 10) * limit;

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
    multerUploads(req, res, () => {
      const {
        email: Email, bio: Bio, firstname: Firstname, lastname: Lastname
      } = req.body;

      const updateUser = (Image) => {
        const { decoded, userFound } = req;
        if (userFound.id !== decoded.userId) {
          return res.status(403).json({
            message: 'Access denied.'
          });
        }
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
      };
      if (req.file) {
        const file = dataUri(req);
        cloudinaryConfig();
        uploader.upload(
          file.content,
          (result) => {
            const image = result.url;
            return updateUser(image);
          },
        );
      } else {
        updateUser();
      }
    });
  }

  /**
   * Get a featured user with posts
   * @param {*} req - Request object
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} - user
   */
  static getFeaturedAuthor(req, res, next) {
    const author = process.env.FT_AUTHOR;

    User.findOne({
      where: {
        username: {
          [Op.eq]: author
        }
      },
      attributes: ['id', 'username', 'firstname', 'lastname', 'image'],
      include: [{
        model: Article,
        as: 'articles',
        attributes: ['id', 'slug', 'title', 'readingTime'],
      }]
    })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            message: `The user ${author} was not found`
          });
        }

        return res.status(200).json({ user });
      })
      .catch(next);
  }
}

export default UserController;
