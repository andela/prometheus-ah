import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import db from '../database/models';
import sendVerifyEmailMessage from './helpers/emailSender';

const { User } = db;
const secret = process.env.SECRET_KEY;
const secret2 = process.env.EMAIL_SECRET_KEY;

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
    const { hash } = req.params;

    const myKey = crypto.createDecipher('aes192', secret2);
    let decodedHash = myKey.update(hash, 'hex', 'utf8');
    decodedHash += myKey.final('utf8');
    User.findOne({
      where: {
        email: decodedHash
      }
    }).then((userFound) => {
      const currentTime = (new Date());
      if (userFound.isVerified) {
        return res.status(400).json({
          message: 'Your account has already been activated.'
        });
      }
      if (userFound.verify_hash_expiration < currentTime) {
        return res.status(400).json({
          message: 'The verification link has expired.'
        });
      }

      User.update({
        isVerified: true,
        hash: '',
        verify_hash_expiration: null
      }, {
        where: {
          email: decodedHash
        }
      }).then((user) => {
        const token = jwt.sign({ userId: userFound.id }, secret, { expiresIn: '24h' });
        if (user) {
          return res.status(200).json({
            message: 'Your account was successfully activated.',
            token
          });
        }
      }).catch(err => res.status(500).json(err.message));
    }).catch(next);
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
      sendVerifyEmailMessage(userToBeVerified);
      res.status(200).json({
        message: 'A verification email has been sent to you.'
      });
    }).catch(next);
  }
}

export default EmailVerifyController;
