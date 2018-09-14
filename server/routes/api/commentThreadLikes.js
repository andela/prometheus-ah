import express from 'express';
import Authenticate from '../../middlewares/Authenticate';
import CommentThreadLikesController from '../../controllers/CommentThreadLikesController';
import CommentValidation from '../../middlewares/validations/CommentValidation';
import Queryvalidation from '../../middlewares/validations/QueryValidation';

const router = express.Router();

router.get(
  '/:id/likes',
  CommentValidation.validateId,
  Queryvalidation.queryValidation,
  CommentThreadLikesController.getLikes
);

router.use(Authenticate.auth);

router.post(
  '/:id/likes',
  CommentValidation.validateId,
  Queryvalidation.queryValidation,
  CommentThreadLikesController.likeReply
);

router.delete(
  '/:id/likes',
  CommentValidation.validateId,
  Queryvalidation.queryValidation,
  CommentThreadLikesController.unLikeReply
);

export default router;
