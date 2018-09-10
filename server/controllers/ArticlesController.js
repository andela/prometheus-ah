import db from '../database/models/index';
import ReadingTime from '../utils/ReadingTime';

const { Article } = db;

/**
 * @param {param} req
 * @param {param} res
 * @param {func} next
 */
class ArticlesController {
  /**
 * @param {obj} req
 * @param {obj} res
 * @param {obj} next
 * @returns {json} createArticles
 */
  static createArticles(req, res, next) {
    const {
      title, body, description
    } = req.body;
    const readingTime = ReadingTime.wordCount(body);

    const { userId } = req.decoded;

    Article.create({
      title,
      body,
      description,
      userId,
      readingTime
    })
      .then((article) => {
        res.status(201).json({
          article
        });
      })
      .catch(next);
  }

  /**
 * @param {obj} req
 * @param {obj} res
 * @param {obj} next
 * @returns {json} getArticles
 */
  static getArticles(req, res, next) {
    const { page, limit, order } = req.query;
    const offset = parseInt((page - 1), 10) * limit;

    Article.findAndCountAll({
      order: [
        ['createdAt', order]
      ],
      offset,
      limit
    })
      .then((article) => {
        const { count } = article;
        const pageCount = Math.ceil(count / limit);
        return res.status(200).json({
          paginationMeta: {
            currentPage: page,
            pageSize: limit,
            totalCount: count,
            resultCount: article.rows.length,
            pageCount,
          },
          articles: article.rows
        });
      })
      .catch(next);
  }

  /**
 * @param {obj} req
 * @param {obj} res
 * @param {obj} next
 * @returns {json} articles
 */
  static getSingleArticle(req, res, next) {
    Article.findOne(
      {
        where: {
          slug: req.params.slug
        }
      }
    )
      .then((article) => {
        if (!article) {
          return res.status(400).json({
            message: 'Article not found'
          });
        }
        return res.status(200).json({
          article
        });
      })
      .catch(next);
  }

  /**
 * @param {obj} req
 * @param {obj} res
 * @param {obj} next
 * @returns {json} articles
 */
  static updateArticle(req, res, next) {
    const { title, body, description } = req.body;
    Article.findOne(
      {
        where: {
          slug: req.params.slug
        }
      }
    )
      .then((article) => {
        if (!article) {
          return res.status(404).json({
            message: 'Article not found'
          });
        }
        if (article.userId !== req.decoded.userId) {
          return res.status(403).json({
            message: 'Access denied.'
          });
        }
        if (title || body || description) {
          if (body) {
            req.body.readingTime = ReadingTime.wordCount(body);
          }
          article.update(req.body)
            .then(updateArticle => res.status(200).json({
              message: 'Article updated successfully',
              article: updateArticle
            }));
        } else {
          return res.status(400).json({
            message: 'Invalid request sent.'
          });
        }
      })
      .catch(next);
  }

  /**
 * @param {obj} req
 * @param {obj} res
 * @param {obj} next
 * @returns {json} articles
 */
  static deleteArticle(req, res, next) {
    Article.findOne(
      {
        where: {
          slug: req.params.slug
        }
      }
    )
      .then((article) => {
        if (!article) {
          return res.status(404).json({
            message: 'Article not found'
          });
        }
        if (article.userId !== req.decoded.userId) {
          return res.status(403).json({
            message: 'Access denied.'
          });
        }
        article.destroy();

        return res.status(200).json({
          message: 'Article deleted successfully'
        });
      })
      .catch(next);
  }
}

export default ArticlesController;
