import express from 'express';
import FollowController from '../../controllers/FollowController';
import Authenticate from '../../middlewares/Authenticate';
import followInput from '../../middlewares/validations/AuthValidation';

const follow = express.Router();
follow.post('/profiles/:username/follow',
  Authenticate.auth,
  followInput.followInputValidation,
  FollowController.followUser);
follow.delete('/profiles/:username/unfollow', Authenticate.auth,
  followInput.followInputValidation,
  FollowController.unfollowUser);
follow.get('/profiles/:username/following',
  Authenticate.auth,
  followInput.followInputValidation, FollowController.getAllUserIFollow);
follow.get('/profiles/:username/followers',
  Authenticate.auth,
  followInput.followInputValidation,
  FollowController.getAllMyFollowers);
export default follow;
