import express from 'express';
import articlesController from '../../controllers/ArticlesController';
import ArticleValidation from '../../middlewares/ArticleValidation';
import authenticate from '../../middlewares/Authenticate';

const article = express.Router();

article.get('/', articlesController.getArticles);
article.get('/:slug', articlesController.getSingleArticle);

article.use(authenticate.auth);

article.post('/', ArticleValidation.createArticle, articlesController.createArticles);
article.put('/:slug', articlesController.updateArticle);
article.delete('/:slug', articlesController.deleteArticle);

export default article;
