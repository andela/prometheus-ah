import express from 'express';
import Authenticate from '../../middlewares/Authenticate';
import CommentValidation from '../../middlewares/validations/CommentValidation';
import CommentThreadsController from '../../controllers/CommentThreadsController';
import Queryvalidation from '../../middlewares/validations/QueryValidation';

const router = express.Router();

router.get(
  '/:id/replies',
  CommentValidation.validateId,
  Queryvalidation.queryValidation,
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
