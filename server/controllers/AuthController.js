import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import db from '../database/models';
import Users from '../utils/utilities';
import sendVerifyEmailMessage from './helpers/emailSender';

import resetPassword from './helpers/resetPasswordEmailSender';

dotenv.config();
const { User } = db;
const secret = process.env.SECRET_KEY;
const emailSecret = process.env.EMAIL_SECRET_KEY;
const passwordSecret = process.env.PASSWORD_SECRET_KEY;
/**
 * Class representing users
 */
class AuthController {
  /**
   * Register a user and return a JWT token
   * @param {*} req - Request object
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {token} token - JWT token
   */
  static signUpUser(req, res, next) {
    const {
      password, bio, firstname, lastname
    } = req.body.user;
    let { email } = req.body.user;
    email = email.toLowerCase();

    let { username } = req.body.user;
    username = username.toLowerCase();

    const emailTokenExpiredTime = new Date();
    const emailHash = jwt.sign({
      email,
      emailTokenExpiredTime
    }, emailSecret, { expiresIn: 7200 });
    User.find({
      where: {
        [Op.or]: [{ username }, { email }]
      }
    }).then((existingUser) => {
      if (existingUser) {
        return res.status(409).json({
          message: 'Email or Username is already in use by another User.'
        });
      }
      User.create({
        firstname,
        lastname,
        username,
        email,
        password: Users.hashPassword(password),
        hash: emailHash,
        bio
      })
        .then((user) => {
          const token = jwt.sign(
            {
              userId: user.id,
              username: user.username,
              role: user.role,
              isVerified: user.isVerified,
              image: user.image,
            }, secret, { expiresIn: '24h' }
          );
          if (process.env.NODE_ENV !== 'test') {
            sendVerifyEmailMessage(user);
          }
          res.status(201).json({
            user: { ...user.toAuthJSON(), token },
            message: `A verification email has been sent to ${user.email}.`,
          });
        })
        .catch(next);
    });
  }

  /**
   * Sign In a user and return a JWT token
   * @param {*} req - Request object
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {token} token - JWT token
   */
  static signInUser(req, res, next) {
    const { password } = req.body.user;
    let { username } = req.body.user;
    username = username.toLowerCase();
    User.findOne({
      where: {
        username
      },
    }).then((user) => {
      if (user) {
        if (user.status === 'blocked') {
          return res.status(403).json({
            message: 'You have been blocked from accessing this site, contact the admin'
          });
        }
        if (bcrypt.compareSync(password, user.password)) {
          const token = jwt.sign({
            userId: user.id,
            username: user.username,
            role: user.role,
            isVerified: user.isVerified,
            image: user.image,
            email: user.email
          }, secret, { expiresIn: '24h' });
          return res.status(200).json({
            message: 'Welcome User you are now logged in.',
            user: {
              email: user.email,
              isVerified: user.isVerified,
              token
            }
          });
        }
        return res.status(400).json({
          message: 'Username or password does not match.'
        });
      }
      return res.status(404).json({
        message: 'You are yet to register. Kindly sign up.'
      });
    }).catch(next);
  }

  /**
   * It should enable a User get a reset password link
   * @param {*} req - Request object
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {message} a message - reset password message
   */
  static resetPassword(req, res, next) {
    const { email } = req.body.user;
    const passwordTokenExpiredTime = new Date();
    const passwordHash = jwt.sign({
      email,
      passwordTokenExpiredTime
    }, passwordSecret, { expiresIn: '2h' });
    User.find({
      where: {
        email
      }
    }).then((userFound) => {
      if (!userFound) {
        return res.status(404).json({
          message: 'Email was not found'
        });
      }
      userFound.update({
        reset_password_hash: passwordHash,
      }).then((user) => {
        if (process.env.NODE_ENV !== 'test') {
          resetPassword(userFound);
        }
        return res.status(200).json({
          message: `A reset password link has been sent to ${user.email}`
        });
      }).catch(next);
    }).catch(next);
  }

  /**
     * Update a user password
     * @param {*} req - Request object
     * @param {*} res - Response object
     * @param {*} next - Next function
     * @returns {message} message
     */
  static updatePassword(req, res, next) {
    const { password, passwordtoken } = req.body.user;
    jwt.verify(passwordtoken, passwordSecret, (err, decodedUserDetails) => {
      if (err) {
        return res.status(500).json({
          message: 'Your verification link has expired or is invalid '
        });
      }
      User.find({
        where: {
          email: decodedUserDetails.email
        }
      }).then((user) => {
        if (user && user.reset_password_hash === passwordtoken) {
          user.update({
            password: Users.hashPassword(password),
          })
            .then(() => res.status(200).json({
              message: 'Password successfully updated, you can now login with your new password'
            })).catch(next);
        } else {
          return res.status(400).json({
            message: 'Invalid token sent'
          });
        }
      }).catch(next);
    });
  }

  /**
     * Update a user password
     * @param {*} req - Request object
     * @param {*} res - Response object
     * @param {*} next - Next function
     * @returns {message} message
     */
  static changePassword(req, res, next) {
    const { oldPassword, password } = req.body;
    User.findOne({
      where: {
        id: req.decoded.userId
      }
    }).then((user) => {
      if (!bcrypt.compareSync(oldPassword, user.password)) {
        return res.status(401).json({
          message: 'password incorrect, try again'
        });
      }
      if (bcrypt.compareSync(password, user.password)) {
        return res.status(409).json({
          message: 'New password is the same as previous password'
        });
      }
      const hashPassword = Users.hashPassword(password);
      user.update({
        password: hashPassword
      });
      const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '24h' });
      return res.status(200).json({
        message: 'Password successfully updated, you can now login with your new password',
        user: { ...user.toAuthJSON(), token },
      });
    }).catch(next);
  }
}
export default AuthController;
