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
      email, username, bio, firstname, lastname
    } = req.body.user;
    const password = bcrypt.hashSync(req.body.user.password, 10);
    User.find({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    }).then((existingUser) => {
      if (existingUser) {
        return res.status(409).json({
          message: 'Email or Username is already in use by another User.',
        });
      }
      User.create({
        firstname,
        lastname,
        username,
        email,
        password,
        bio,
      })
        .then((user) => {
          const token = jwt.sign({ userId: user.id }, secret, {
            expiresIn: '24h',
          });
          res.status(201).json({
            user: { ...user.toAuthJSON(), token },
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
        username,
      },
    })
      .then((user) => {
        if (user) {
          if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign(
              {
                userId: user.id,
                username: user.username,
              },
              secret,
              { expiresIn: '24h' }
            );
            return res.status(200).json({
              message: 'Welcome User you are now logged in.',
              user: {
                email: user.email,
                token,
              },
            });
          }
          return res.status(401).json({
            message: 'Username or password does not match.',
          });
        }
        return res.status(404).json({
          message: 'Username or password does not match.',
        });
      })
      .catch(next);
  }

  /**
   * Get all users profile
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} user - User object
   */
  static getAllUserProfile(req, res, next) {
    const page = parseInt((req.query.page || 1), 10);
    const limit = parseInt((req.query.limit || 10), 10);
    const offset = parseInt((page - 1), 10) * limit;
    let order = req.query.order || 'ASC';
    order = order.toUpperCase();

    if (order !== 'ASC' && order !== 'DESC') {
      return res.status(400).json({
        message: 'order can only be ASC or DESC'
      });
    }

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
        if (users.rows.length === 0) {
          return res.status(200).json({
            message: 'No user on this page',
            users: users.rows,
          });
        }
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
}

export default UserController;
