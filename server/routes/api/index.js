import express from 'express';
import users from './users';
import socialLogin from './socialLogin';

const router = express.Router();

router.use('/', users);
router.use('/', socialLogin);

module.exports = router;
