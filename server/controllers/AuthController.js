import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import crypto from 'crypto';
import db from '../database/models';
import Users from '../utils/utilities';
import sendVerifyEmailMessage from './helpers/emailSender';


dotenv.config();

const { User } = db;
const secret = process.env.SECRET_KEY;
const secret2 = process.env.EMAIL_SECRET_KEY;

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
      email, username, password, bio, firstname, lastname
    } = req.body.user;

    const myKey = crypto.createCipher('aes192', secret2);
    let hash = myKey.update(email, 'utf8', 'hex');
    hash += myKey.final('hex');
    const tokenExpiredTime = new Date();
    tokenExpiredTime.setHours(tokenExpiredTime.getHours() + 2);
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
        hash,
        verify_hash_expiration: tokenExpiredTime,
        bio
      })
        .then((user) => {
          const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '24h' });
          sendVerifyEmailMessage(user);
          res.status(201).json({
            user: { ...user.toAuthJSON(), token },
            message: `A verification email has been sent to ${user.email}.`,
          });
          const userWithToken = { data: user.toAuthJSON() };
          sendVerifyEmailMessage(userWithToken);
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
    const { username, password } = req.body.user;
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
}

export default AuthController;
