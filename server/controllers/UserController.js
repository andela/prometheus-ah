import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import db from '../database/models';

dotenv.config();

const { User } = db;
const secret = process.env.SECRET_KEY;

/**
 * Class representing users
 */
class UserController {
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
        password,
        bio
      })
        .then((user) => {
          const token = jwt.sign({ userId: user.id }, secret, {
            expiresIn: '24h'
          });
          res.status(201).json({
            user: { ...user.toAuthJSON(), token }
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
    const { username, password } = req.body.user;
    User.findOne({
      where: {
        username
      },
    }).then((user) => {
      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          const token = jwt.sign({
            userId: user.id,
            username: user.username,
          }, secret, { expiresIn: '24h' });
          return res.status(200).json({
            message: 'Welcome User you are now logged in.',
            user: {
              email: user.email,
              token
            }
          });
        }
        return res.status(401).json({
          message: 'Username or password does not match.'
        });
      }
      return res.status(404).json({
        message: 'Username or password does not match.'
      });
    }).catch(next);
  }

  /**
   * Get a users profile
   * @param {*} req - Request object
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {profile} token - JWT token(Optional)
   */
  static getProfile(req, res) {
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
    const { decoded, userFound } = req;
    if (userFound.id !== decoded.userId) {
      return res.status(403).json({
        message: 'You are not authorized to continue'
      });
    }
    const {
      email: Email, bio: Bio, image: Image, firstname: Firstname, lastname: Lastname
    } = req.body.user;
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
  }
}

export default UserController;
