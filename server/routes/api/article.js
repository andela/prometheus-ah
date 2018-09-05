import express from 'express';
import ArticlesController from '../../controllers/ArticlesController';
import ArticleValidation from '../../middlewares/validations/ArticleValidation';
import Authenticate from '../../middlewares/Authenticate';

const article = express.Router();

article.get('/', ArticlesController.getArticles);
article.get('/:slug', ArticlesController.getSingleArticle);

article.use(Authenticate.auth);

article.post('/', ArticleValidation.createArticle, ArticlesController.createArticles);
article.put('/:slug', ArticlesController.updateArticle);
article.delete('/:slug', ArticlesController.deleteArticle);

export default article;
