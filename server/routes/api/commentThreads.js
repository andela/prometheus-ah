import express from 'express';
import Authenticate from '../../middlewares/Authenticate';
import CommentValidation from '../../middlewares/validations/CommentValidation';
import CommentThreadsController from '../../controllers/CommentThreadsController';

const router = express.Router();

router.get(
  '/:commentId/replies/:id',
  CommentValidation.validatethreadIds,
  CommentThreadsController.getReply
);

router.get(
  '/:id/replies',
  CommentValidation.validateId,
  CommentThreadsController.getAllReplies
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

export default router;
