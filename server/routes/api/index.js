import express from 'express';
import commentThread from './commentThreads';
import commentThreadLikes from './commentThreadLikes';
import users from './users';
import admin from './admin';
import socialLogin from './socialLogin';
import article from './article';
import featuredArticles from './featuredArticles';
import follow from './follow';
import reports from './reports';
import reportCategories from './reportCategories';

const router = express.Router();

router.use('/admin', admin);
router.use('/', users);
router.use('/', socialLogin);
router.use('/articles', article);
router.use('/', featuredArticles);

router.use('/comments', commentThread);
router.use('/replies', commentThreadLikes);
router.use('/reports', reports);
router.use('/reportCategories', reportCategories);

router.use('/', follow);


export default router;
