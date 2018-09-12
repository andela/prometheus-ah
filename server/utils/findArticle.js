import db from '../database/models';

const { Article } = db;

/**
 * Class Utilities
 */
class Articles {
  /**
   * find an article by it's slug
   * @param {*} req - Request object
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {article} article
   */
  static findArticleBySlug(req, res, next) {
    Article.findOne({
      where: {
        slug: req.params.slug
      }
    })
      .then((articleFound) => {
        if (!articleFound) {
          return res.status(404).json({
            message: 'Article not found'
          });
        }
        if (articleFound.userId !== req.decoded.userId) {
          return res.status(403).json({
            message: 'Access denied.'
          });
        }
        req.article = articleFound;
        return next();
      })
      .catch(next);
  }
}

export default Articles;
