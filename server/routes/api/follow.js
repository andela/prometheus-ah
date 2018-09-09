import express from 'express';
import FollowController from '../../controllers/FollowController';
import Authenticate from '../../middlewares/Authenticate';

const follow = express.Router();

follow.post('/profiles/:username/follow', Authenticate.auth, FollowController.followUser);
follow.delete('/profiles/:username/unfollow', Authenticate.auth, FollowController.unfollowUser);
follow.get('/profiles/:username/following', Authenticate.auth, FollowController.getAllUserIFollow);
follow.get('/profiles/:username/followers', Authenticate.auth, FollowController.getAllMyFollowers);

export default follow;
