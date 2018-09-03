import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../database/models';

dotenv.config();

const secret = process.env.SECRET_KEY;

const Auth = {
  verify: (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            message: 'You do not have permission to this page.'
          });
        }
        User.findById(decoded.id)
          .then((user) => {
            if (!user) {
              return res.status(401).json({
                message: 'User with this token not found.'
              });
            }
            req.decoded = decoded;
            next();
          }).catch(error => res.status(400).json(error));
      });
    }
    return res.status(401).json({
      message: 'You need to signup or login to perform this action'
    });
  }
};

export default Auth;
