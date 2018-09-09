import express from 'express';
import ArticlesController from '../../controllers/ArticlesController';
import ArticleValidation from '../../middlewares/validations/ArticleValidation';
import Authenticate from '../../middlewares/Authenticate';
import CommentsController from '../../controllers/CommentsController';
import CommentValidation from '../../middlewares/validations/CommentValidation';

const router = express.Router();

// Article endpoints
router.get('/', ArticlesController.getArticles);
router.get('/:slug', ArticlesController.getSingleArticle);

// Comment endpoints
router.get(
  '/:slug/comments/:id',
  CommentValidation.validateId,
  CommentsController.getComment
);
router.get('/:slug/comments/', CommentsController.getAllComments);

router.use(Authenticate.auth);

// Article endpoints (Protected)
router.post(
  '/',
  ArticleValidation.createArticle,
  ArticlesController.createArticles
);
router.put('/:slug', ArticlesController.updateArticle);
router.delete('/:slug', ArticlesController.deleteArticle);

// Comment endpoints (Protected)
router.post(
  '/:slug/comments',
  CommentValidation.commentValidate,
  CommentsController.createComment
);
router.put(
  '/:slug/comments/:id',
  CommentValidation.validateId,
  CommentValidation.commentValidate,
  CommentsController.updateComment
);
router.delete(
  '/:slug/comments/:id',
  CommentValidation.validateId,
  CommentsController.deleteComment
);

export default router;
