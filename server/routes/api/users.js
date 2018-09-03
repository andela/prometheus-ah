import express from 'express';
import db from '../../database/models';
import UserController from '../../controllers/UserController';

const router = express.Router();

const { User } = db;

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

router.post('/users', UserController.signUpUser);
router.post('/users/login', UserController.signInUser);

export default router;
