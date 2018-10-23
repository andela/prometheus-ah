import express from 'express';
import ArticlesController from '../../controllers/ArticlesController';

const router = express.Router();

router.get(
  '/featuredArticles',
  ArticlesController.getFeaturedArticles
);

export default router;
