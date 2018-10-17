import jwt from 'jsonwebtoken';
import db from '../database/models';

const secret = process.env.SECRET_KEY;
const { User } = db;
/**
 * @class AuthController
 *
 */
class AuthController {
  /**
   * @description - finds an existing user or create a new user
   * @static
   *
   *
   * @param {object} user
   * @param {function} done
   *
   * @returns {object} createOrFindUser
   *
   * @memberof AuthController
   *
   */
  static modelQuery(user, done) {
    User.findOrCreate({
      where: {
        email: user.email
      },
      defaults: user,
    }).spread((foundOrCreated, created) => {
      const {
        id, email, username, firstName, lastName, image, socialLoginType
      } = foundOrCreated.dataValues;
      done(null, {
        email, id, username, firstName, lastName, image, socialLoginType, created,
      });
    });
  }

  /**
 * @description response function
 * @static
 * @param {object} req
 * @param {object} res
 * @returns {json} json
 * @memberOf AuthController
 */
  static response(req, res) {
    User.findOne({
      where: {
        username: req.user.username,
      }
    }).then((data) => {
      const user = {
        email: data.email,
        username: data.username,
        lastName: data.lastName,
        firstName: data.firstName,
        token: jwt.sign(
          {
            userId: data.id,
            username: data.username,
            role: data.role,
            isVerified: data.isVerified,
            image: data.image
          }, secret, { expiresIn: '1d' }
        ),
      };
      if (req.user.created) {
        return res.status(201).json({
          message: 'User successfully created', user
        });
      }
      return res.status(200).json({ message: 'authentication successful', user });
    }).catch(err => (err.message));
  }

  /**
   * @description - callback function for strategy
   * @static
   *
   * @param {object} accessToken
   * @param {object} refreshToken
   * @param {object} profile
   * @param {function} done
   *
   * @returns {json} json
   *
   * @memberof AuthController
   *
   */
  static passportCallback(accessToken, refreshToken, profile, done) {
    const userProfile = {
      firstname: profile.name.familyName,
      lastname: profile.name.givenName,
      username: profile.displayName,
      email: profile.emails[0].value,
      image: profile.photos[0].value,
      socialLoginType: profile.provider
    };
    AuthController.modelQuery(userProfile, done);
  }
}
export default AuthController;
