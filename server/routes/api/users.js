import express from 'express';
import UserController from '../../controllers/UserController';
import AuthController from '../../controllers/AuthController';
import UserInputValidation from '../../middlewares/AuthValidation';
import Authenticate from '../../middlewares/Authenticate';
import Users from '../../utils/utilities';
import UserValidation from '../../middlewares/UserValidation';

const router = express.Router();

router.get('/', (req, res) => res.status(404).json({
  message: 'Welcome to Author Haven.'
}));

router.get(
  '/profiles',
  Authenticate.auth,
  UserInputValidation.queryValidation,
  UserController.getAllUserProfile
);
router.post('/users', UserInputValidation.signUpInputValidation, AuthController.signUpUser);
router.post('/users/login', UserInputValidation.loginInputValidation, AuthController.signInUser);
router.get('/profiles/:username', Users.findUserByUsername, UserController.getProfileByUsername);
router.put('/profiles/:username',
  Authenticate.auth,
  Users.findUserByUsername,
  UserValidation.editUserProfile,
  UserController.editProfile);

export default router;
