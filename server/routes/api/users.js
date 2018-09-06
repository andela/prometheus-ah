import express from 'express';
import db from '../../database/models';
import UserController from '../../controllers/UserController';
import UserInputValidation from '../../middlewares/AuthValidation';
import Authentication from '../../middlewares/Authenticate';

const router = express.Router();

const { User } = db;

router.get('/', (req, res) => res.status(404).json({
  message: 'Welcome to Author Haven.'
}));

router.put('/user/:id', (req, res, next) => (
  User
    .find({
      where: {
        id: req.params.id
      }
    })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: 'User Not Found'
        });
      }
      return user
        .update({
          username: req.body.user.username,
          email: req.body.user.email,
          bio: req.body.user.bio || user.bio,
          image: req.body.user.image || user.image
        })
        .then(updatedUser => res.status(200).json({ user: updatedUser.toAuthJSON() }))
        .catch(next);
    })
    .catch(next)
));

router.post('/users', UserInputValidation.signUpInputValidation, UserController.signUpUser);
router.post('/users/login', UserInputValidation.loginInputValidation, UserController.signInUser);
router.get(
  '/profiles',
  Authentication.auth,
  UserInputValidation.queryValidation,
  UserController.getAllUserProfile
);

export default router;
