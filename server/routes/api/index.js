import express from 'express';
import users from './users';
import socialLogin from './socialLogin';
import article from './article';

const router = express.Router();

router.use('/', users);
router.use('/', socialLogin);
router.use('/articles', article);

module.exports = router;
