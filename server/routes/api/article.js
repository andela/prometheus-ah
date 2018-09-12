import express from 'express';

import ArticlesController from '../../controllers/ArticlesController';
import ArticleValidation from '../../middlewares/validations/ArticleValidation';

import Authenticate from '../../middlewares/Authenticate';

import CommentsController from '../../controllers/CommentsController';
import CommentValidation from '../../middlewares/validations/CommentValidation';
import BookmarkController from '../../controllers/BookmarkController';
import QueryValidation from '../../middlewares/validations/QueryValidation';
import RatingsController from '../../controllers/RatingsController';
import RatingsValidation from '../../middlewares/validations/RatingsValidation';
import ReportsController from '../../controllers/ReportsController';
import ReportValidation from '../../middlewares/validations/ReportValidation';
import Articles from '../../utils/findArticle';

const router = express.Router();

// Article endpoints
router.get('/', QueryValidation.queryValidation, ArticlesController.getArticles);
router.get('/:slug', ArticlesController.getSingleArticle);

// Rating endpoint
router.get(
  '/:slug/ratings/',
  RatingsValidation.validateArticleId,
  QueryValidation.queryValidation,
  RatingsController.getRatings
);

router.use(Authenticate.auth);

router.post('/user/bookmarks/:slug', BookmarkController.bookmarkArticle);
router.get('/user/bookmarks', BookmarkController.getBookmarks);

// Comment endpoints
router.get(
  '/:slug/comments/',
  QueryValidation.queryValidation,
  CommentsController.getAllComments
);

// Article endpoints (Protected)
router.post(
  '/',
  ArticleValidation.createArticle,
  ArticlesController.createArticles
);

router.put(
  '/:slug',
  ArticleValidation.updateArticle,
  Articles.findArticleBySlug,
  ArticlesController.updateArticle
);
router.delete('/:slug', Articles.findArticleBySlug, ArticlesController.deleteArticle);

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

// Report Article Endpoint (Protected)
router.post(
  '/:slug/reports',
  ReportValidation.validateReport,
  ReportsController.createReport
);

export default router;
