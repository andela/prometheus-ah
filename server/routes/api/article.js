import express from 'express';

import ArticlesController from '../../controllers/ArticlesController';
import ArticleValidation from '../../middlewares/validations/ArticleValidation';

import Authenticate from '../../middlewares/Authenticate';

import CommentsController from '../../controllers/CommentsController';
import CommentValidation from '../../middlewares/validations/CommentValidation';
import Queryvalidation from '../../middlewares/validations/QueryValidation';
import BookmarkController from '../../controllers/BookmarkController';

import RatingsController from '../../controllers/RatingsController';
import RatingsValidation from '../../middlewares/validations/RatingsValidation';

const router = express.Router();

// Article endpoints
router.get('/', ArticlesController.getArticles);
router.get('/:slug', ArticlesController.getSingleArticle);

// Ratting endpoint
router.get(
  '/:slug/ratings/',
  RatingsValidation.validateArticleId,
  Queryvalidation.queryValidation,
  RatingsController.getRatings
);

router.use(Authenticate.auth);

router.post('/user/bookmarks/:slug', BookmarkController.bookmarkArticle);
router.get('/user/bookmarks', BookmarkController.getBookmarks);

// Comment endpoints
router.get(
  '/:slug/comments/',
  Queryvalidation.queryValidation,
  CommentsController.getAllComments
);

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

// Rating endpoints (Protected)
router.put(
  '/:slug/ratings/:ratingId',
  RatingsValidation.validateRating,
  RatingsValidation.modifyRating,
  RatingsController.updateRating
);

router.delete(
  '/:slug/ratings/:ratingId',
  RatingsValidation.modifyRating,
  RatingsController.deleteRating
);

router.post(
  '/:slug/ratings/',
  RatingsValidation.validateRating,
  RatingsValidation.validateUserRating,
  RatingsController.createRating
);

export default router;
