import express from 'express';
import Authentication from '../../middlewares/Authenticate';
import CommentValidation from '../../middlewares/CommentValidation';
import CommentThreadsController from '../../controllers/CommentThreadsController';

const commentThread = express.Router();

commentThread.post(
  '/comments/:id/replies',
  Authentication.auth,
  CommentValidation.validateId,
  CommentValidation.commentValidate,
  CommentThreadsController.createReply
);

commentThread.put(
  '/comments/:commentId/replies/:id',
  Authentication.auth,
  CommentValidation.validatethreadIds,
  CommentValidation.commentValidate,
  CommentThreadsController.updateReply
);

commentThread.get(
  '/comments/:commentId/replies/:id',
  CommentValidation.validatethreadIds,
  CommentThreadsController.getReply
);

commentThread.get(
  '/comments/:id/replies',
  CommentValidation.validateId,
  CommentThreadsController.getAllReplies
);

commentThread.delete(
  '/comments/:commentId/replies/:id',
  Authentication.auth,
  CommentValidation.validatethreadIds,
  CommentThreadsController.deleteReply
);

export default commentThread;
