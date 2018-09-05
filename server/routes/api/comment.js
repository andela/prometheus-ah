import express from 'express';
import Authentication from '../../middlewares/Authenticate';
import CommentsController from '../../controllers/CommentsController';
import CommentValidation from '../../middlewares/CommentValidation';

const comment = express.Router();

comment.post(
  '/articles/:slug/comments',
  Authentication.auth,
  CommentValidation.commentValidate,
  CommentsController.createComment
);

comment.put(
  '/articles/:slug/comments/:id',
  Authentication.auth,
  CommentValidation.validateId,
  CommentValidation.commentValidate,
  CommentsController.updateComment
);

comment.get(
  '/articles/:slug/comments/:id',
  CommentValidation.validateId,
  CommentsController.getComment
);

comment.get(
  '/articles/:slug/comments/',
  CommentsController.getAllComments
);

comment.delete(
  '/articles/:slug/comments/:id',
  Authentication.auth,
  CommentValidation.validateId,
  CommentsController.deleteComment
);

export default comment;
