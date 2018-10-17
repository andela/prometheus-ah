import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import db from '../../database/models';

dotenv.config();
const { User } = db;

const secret = process.env.SECRET_KEY;

/**
 * @class Authenticate
 */
class OptionalAuthentication {
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
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            message: 'You do not have permission to this page.'
          });
        }
        User.findById(decoded.userId)
          .then((user) => {
            if (!user) {
              return res.status(401).json({
                message: 'User with this token not found.'
              });
            }
            req.decoded = {
              ...user.toAuthJSON(), userId: decoded.userId
            };
            next();
          })
          .catch(next);
      });
    } else {
      next();
    }
  }
}

export default OptionalAuthentication;
