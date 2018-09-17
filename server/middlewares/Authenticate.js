import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import db from '../database/models';

dotenv.config();
const { User } = db;

const secret = process.env.SECRET_KEY;

/**
 * @class Authenticate
 */
class Authenticate {
  /**
 * @description it authenticates the validity of user
 *
 * @return {void}
 *
 * @param {param} req
 * @param {param} res
 * @param {func} next
 */
  static auth(req, res, next) {
    const token = req.headers.authorization;
    if (token) {
      Authenticate.verifyUser(req, res, next, token);
    } else {
      return res.status(401).json({
        message: 'You need to signup or login to perform this action'
      });
    }
  }

  /**
 * @description it authenticates the validity of user
 *
 * @return {void}
 *
 * @param {param} req
 * @param {param} res
 * @param {func} next
 */
  static optionalAuth(req, res, next) {
    const token = req.headers.authorization;
    if (token) {
      Authenticate.verifyUser(req, res, next, token);
    } else {
      next();
    }
  }

  /**
 * @description it authenticates the validity of user
 *
 * @return {void}
 *
 * @param {param} req
 * @param {param} res
 * @param {func} next
 * @param {param} token
 */
  static verifyUser(req, res, next, token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: 'You do not have permission to this page.'
        });
      }
      User.findById(decoded.userId)
        .then((user) => {
          if (user && user.status === 'active') {
            req.decoded = {
              ...user.toAuthJSON(),
              userId: decoded.userId,
              isVerified: decoded.isVerified,
              role: decoded.role,
            };
            return next();
          }
          if (!user) {
            return res.status(401).json({
              message: 'User with this token not found.'
            });
          }
          return res.status(403).json({
            message: 'You have been blocked from accessing this site, contact the admin'
          });
        })
        .catch(next);
    });
  }
}

export default Authenticate;
