import express from 'express';
import commentThread from './commentThreads';
import commentThreadLikes from './commentThreadLikes';
import users from './users';
import admin from './admin';
import socialLogin from './socialLogin';
import follow from './follow';
import reports from './reports';
import reportCategories from './reportCategories';
import readStats from './readStats';
import article from './article';

const router = express.Router();

router.use('/admin', admin);
router.use('/', users);
router.use('/', socialLogin);
router.use('/articles', article);

router.use('/comments', commentThread);
router.use('/replies', commentThreadLikes);
router.use('/reports', reports);
router.use('/reportCategories', reportCategories);

router.use('/', follow);

router.use('/', readStats);


export default router;
