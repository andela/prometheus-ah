import passport from 'passport';
import { Router } from 'express';
import AuthController from '../../controllers/SocialAuthController';

const router = Router();

/**
 * route for google
 * route for facebook
 * route for twitter
 */

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/users/login/google/callback', passport.authenticate('google'),
  AuthController.response);


router.get('/facebook', passport.authenticate('facebook', {
  scope: ['public_profile', 'email']
}));

router.get('/users/login/facebook/callback', passport.authenticate('facebook', { session: false }),
  AuthController.response);

export default router;
