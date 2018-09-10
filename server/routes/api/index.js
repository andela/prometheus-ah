import express from 'express';
import commentThread from './commentThreads';
import commentThreadLikes from './commentThreadLikes';
import users from './users';
import admin from './admin';
import socialLogin from './socialLogin';
import article from './article';
import follow from './follow';
import reports from './reports';

const router = express.Router();

router.use('/admin', admin);
router.use('/', users);
router.use('/', socialLogin);
router.use('/articles', article);

router.use('/comments', commentThread);
router.use('/replies', commentThreadLikes);
router.use('/reports', reports);

router.use('/', follow);


export default router;
