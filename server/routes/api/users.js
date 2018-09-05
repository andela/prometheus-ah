import express from 'express';
import UserController from '../../controllers/UserController';
import UserInputValidation from '../../middlewares/AuthValidation';
import Authentication from '../../middlewares/Authenticate';
import Users from '../../utils/utilities';
import UserValidation from '../../middlewares/UserValidation';

const router = express.Router();

router.get('/', (req, res) => res.status(404).json({
  message: 'Welcome to Author Haven.'
}));

router.post('/users', UserInputValidation.signUpInputValidation, UserController.signUpUser);
router.post('/users/login', UserInputValidation.loginInputValidation, UserController.signInUser);
router.get('/profiles/:username', Users.findUserByUsername, UserController.getProfile);
router.put('/profiles/:username', Authentication.auth, Users.findUserByUsername, UserValidation.editUserProfile, UserController.editProfile);

export default router;
