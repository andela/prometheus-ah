import express from 'express';
import articlesController from '../../controllers/ArticlesController';
import { validateCreateArticle, validateArticleId } from '../../middlewares/article.middleware';
import authenticate from '../../middlewares/authentication';

const articleRoute = express.Router();

articleRoute.get('/', articlesController.getArticles);
articleRoute.get('/:articleId', validateArticleId, articlesController.getSingleArticle);

articleRoute.use(authenticate.auth);

articleRoute.post('/', validateCreateArticle, articlesController.createArticles);
articleRoute.put('/:articleId', validateArticleId, articlesController.updateArticle);
articleRoute.delete('/:articleId', validateArticleId, articlesController.deleteArticle);

module.exports = articleRoute;
