import slugify from 'slugify';

import db from '../database/models/index';

const { Article } = db;

class ArticlesController {
  static createArticles(req, res, next) {
    const {
      title, body
    } = req.body;

    const slug = slugify(title);

    Article.create({
      title,
      slug,
      body
    })
      .then((article) => {
        res.status(201).json({
          article
        });
      })
      .catch(next);
  }

  static getArticles(req, res, next) {
    Article.findAll()
      .then((article) => {
        res.status(200).json({
          article
        });
      })
      .catch(next);
  }

  static getSingleArticle(req, res, next) {
    Article.findById(parseInt(req.params.articleId, 10))
      .then((article) => {
        res.status(200).json({
          article
        });
      })
      .catch(next);
  }

  static updateArticle(req, res, next) {
    const { articleId } = req.params;
    const { title, body } = req.body;
    Article.update({
      title,
      body
    },
    {
      where: {
        id: articleId
      }
    })
      .then(() => {
        res.status(200).json({
          message: 'Updated article successfully'
        });
      })
      .catch(next);
  }

  static deleteArticle(req, res, next) {
    const { articleId } = req.params;
    Article.destroy({
      where: { id: articleId }
    })
      .then(() => {
        res.status(200).json({
          message: 'Deleted article successfully'
        });
      })
      .catch(next);
  }
}

export default ArticlesController;
