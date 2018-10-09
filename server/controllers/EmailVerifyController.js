import jwt from 'jsonwebtoken';
import db from '../database/models';
import sendVerifyEmailMessage from './helpers/emailSender';

const { User } = db;
const secret = process.env.SECRET_KEY;
const emailSecret = process.env.EMAIL_SECRET_KEY;

/**
 * Class representing email verification
 */
class EmailVerifyController {
  /**
   * Confirm a user email
   * @param {*} req - Request object
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} user - User object
   */
  static emailVerification(req, res, next) {
    const hash = req.query.emailToken;
    jwt.verify(hash, emailSecret, (err, decodedUserData) => {
      if (err) {
        return res.status(500).json({
          message: 'Your verification link has expired or is invalid '
        });
      }
      User.findOne({
        where: {
          email: decodedUserData.email
        }
      }).then((userFound) => {
        if (userFound && userFound.isVerified) {
          return res.status(400).json({
            message: 'Your account has already been activated.'
          });
        } else if (userFound && userFound.hash === hash) {
          userFound.update({
            isVerified: true,
            hash: '',
          }).then((user) => {
            const token = jwt.sign({ userId: userFound.id }, secret, { expiresIn: '24h' });
            if (user) {
              return res.status(200).json({
                message: 'Your account was successfully activated.',
                token,
              });
            }
          }).catch(err => res.status(500).json(err.message));
        } else {
          return res.status(400).json({
            message: 'Invalid token sent'
          });
        }
      }).catch(next);
    });
  }

  /**
   * Resend email verification to user email
   * @param {*} req - Request object
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} user - User object
   */
  static resendEmailVerification(req, res, next) {
    const { email } = req.body.user;
    User.findOne({
      where: {
        email
      }
    }).then((userToBeVerified) => {
      if (!userToBeVerified) {
        return res.status(404).json({
          message: 'The email entered is not registered'
        });
      }
      if (userToBeVerified.isVerified) {
        return res.status(409).json({
          message: 'This email has already been verified.'
        });
      }
      if (process.env.NODE_ENV !== 'test') {
        sendVerifyEmailMessage(userToBeVerified);
      }
      res.status(200).json({
        message: 'A verification email has been sent to you.'
      });
    }).catch(next);
  }
}

export default EmailVerifyController;
