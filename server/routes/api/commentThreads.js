import express from 'express';
import Authenticate from '../../middlewares/Authenticate';
import CommentLikesController from '../../controllers/CommentLikesController';
import CommentThreadsController from '../../controllers/CommentThreadsController';
import CommentValidation from '../../middlewares/validations/CommentValidation';
import Queryvalidation from '../../middlewares/validations/QueryValidation';

const router = express.Router();

router.get(
  '/:id/replies',
  CommentValidation.validateId,
  Queryvalidation.queryValidation,
  CommentThreadsController.getAllReplies
);

router.get(
  '/:id/likes',
  CommentValidation.validateId,
  Queryvalidation.queryValidation,
  CommentLikesController.getLikes,
);

router.use(Authenticate.auth);

router.post(
  '/:id/replies',
  CommentValidation.validateId,
  CommentValidation.commentValidate,
  CommentThreadsController.createReply
);

router.put(
  '/:commentId/replies/:id',
  CommentValidation.validatethreadIds,
  CommentValidation.commentValidate,
  CommentThreadsController.updateReply
);

router.delete(
  '/:commentId/replies/:id',
  CommentValidation.validatethreadIds,
  CommentThreadsController.deleteReply
);

router.post(
  '/:id/likes',
  CommentValidation.validateId,
  Queryvalidation.queryValidation,
  CommentLikesController.likeComment,
);

export default router;
