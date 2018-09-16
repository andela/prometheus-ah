import express from 'express';

import ArticlesController from '../../controllers/ArticlesController';
import ArticleValidation from '../../middlewares/validations/ArticleValidation';
import OptionalAuthentication from '../../middlewares/validations/OptionalAuthentication';

import ReadingStatsController from '../../controllers/ReadingStatsController';

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

import LikeController from '../../controllers/ArticleLikesController';

const router = express.Router();

// Article Feed Endpoint

router.get(
  '/feed',
  Authenticate.auth,
  QueryValidation.queryValidation,
  ArticlesController.articleFeed
);

// Article endpoints
router.get(
  '/',
  Authenticate.optionalAuth,
  QueryValidation.queryValidation,
  ArticlesController.getArticles
);
router.get('/', QueryValidation.queryValidation, ArticlesController.getArticles);
router.get('/:slug', ArticlesController.getSingleArticle);
router.get('/:slug/like', QueryValidation.queryValidation, LikeController.totalLikes);
router.get('/:slug/dislike', QueryValidation.queryValidation, LikeController.totalDislikes);
router.get('/:slug', OptionalAuthentication.auth, ArticlesController.getSingleArticle,
  ReadingStatsController.saveViewed);

// Comment endpoints
router.get(
  '/:slug/comments/',
  QueryValidation.queryValidation,
  CommentsController.getAllComments
);

router.get(
  '/:slug',
  ArticlesController.getSingleArticle
);
router.get(
  '/:slug/like',
  QueryValidation.queryValidation,
  LikeController.totalLikes
);
router.get(
  '/:slug/dislike',
  QueryValidation.queryValidation,
  LikeController.totalDislikes
);

// Comment endpoints
router.get(
  '/:slug/comments/',
  QueryValidation.queryValidation,
  CommentsController.getAllComments
);

// Rating endpoint
router.get(
  '/:slug/ratings/',
  RatingsValidation.validateArticleId,
  QueryValidation.queryValidation,
  RatingsController.getRatings
);

router.use(Authenticate.auth);

router.post(
  '/user/bookmarks/:slug',
  RatingsValidation.validateArticleId,
  BookmarkController.bookmarkArticle
);
router.delete(
  '/user/bookmarks/:slug',
  RatingsValidation.validateArticleId,
  BookmarkController.deleteBookmark
);

// Article endpoints (Protected)
router.post(
  '/',
  ArticleValidation.createArticle,
  ArticlesController.createArticles
);
router.post(
  '/:slug/like',
  LikeController.likeArticle
);
router.post(
  '/:slug/dislike',
  LikeController.dislikeArticle
);

router.put(
  '/:slug',
  ArticleValidation.updateArticle,
  Articles.findArticleBySlug,
  ArticlesController.updateArticle
);
router.delete(
  '/:slug',
  Articles.findArticleBySlug,
  ArticlesController.deleteArticle
);
router.put(
  '/:slug',
  ArticleValidation.updateArticle,
  ArticlesController.updateArticle
);
router.delete(
  '/:slug',
  ArticlesController.deleteArticle
);
router.delete(
  '/:slug/unlike',
  LikeController.unlikeArticle
);

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
