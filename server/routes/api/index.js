import express from 'express';
import commentThread from './commentThreads';
import users from './users';
import socialLogin from './socialLogin';
import article from './article';

const router = express.Router();

router.use('/', users);
router.use('/', socialLogin);
router.use('/articles', article);
router.use('/comments', commentThread);

export default router;
