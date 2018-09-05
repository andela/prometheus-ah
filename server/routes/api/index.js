import express from 'express';
import comment from './comment';
import commentThread from './commentThreads';
import users from './users';
import socialLogin from './socialLogin';
import article from './article';

const router = express.Router();

router.use('/', users);
router.use('/', socialLogin);
router.use('/', comment);
router.use('/articles', article);
router.use('/', commentThread);

router.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce((errors, key) => {
        errors[key] = err.errors[key].message;
        return errors;
      }, {})
    });
  }
  return next(err);
});

export default router;
