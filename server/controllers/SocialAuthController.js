import jwt from 'jsonwebtoken';
import db from '../database/models';

const { SECRET_KEY } = process.env;
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
    const user = {
      email: req.user.email,
      username: req.user.username,
      lastName: req.user.lastName,
      firstName: req.user.firstName,
      token: jwt.sign({ email: req.user.email }, SECRET_KEY, { expiresIn: '1d' }),
    };
    if (req.user.created) {
      return res.status(201).json({
        message: 'User successfully created', user
      });
    }
    return res.status(200).json({ message: 'authentication successful', user });
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
