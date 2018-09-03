import Validator from 'validatorjs';
import db from '../../database/models';

const { Article, Rating } = db;
/**
 *
 */
class RatingsValidation {
  /**
   * @description Validates rating
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   *
   * @return {Function} next
   */
  static validateRating(req, res, next) {
    const { rating } = req.body;

    const data = { rating };

    const rules = {
      rating: 'required|numeric|min:1|max:5'
    };

    const validation = new Validator(data, rules);

    if (validation.passes()) {
      next();
    } else {
      res.status(400).json({
        errors: validation.errors.all()
      });
    }
  }

  /**
  * @description Validates request params id
  *
  * @param {Object} req
  * @param {Object} res
  * @param {Function} next
  *
  * @return {Function} next
  */
  static validateArticleId(req, res, next) {
    const { slug } = req.params;

    Article.findOne({
      where: {
        slug
      },
      attributes: ['id']
    })
      .then((article) => {
        if (!article) {
          return res.status(404).json({
            errors: {
              message: 'Article not found'
            }
          });
        }
        req.articleId = article.id;
        return next();
      })
      .catch(next);
  }


  /**
   * @description Validates rating
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   *
   * @return {Function} next
   */
  static validateUserRating(req, res, next) {
    const { slug } = req.params;
    Article.findOne({
      where: {
        slug
      },
      attributes: ['id']
    })
      .then((article) => {
        if (!article) {
          return res.status(404).json({
            errors: {
              message: 'Article not found'
            }
          });
        }
        req.articleId = article.id;
        Rating
          .findOne({
            where: {
              articleId: article.id,
              userId: req.decoded.userId
            }
          })
          .then((rating) => {
            if (rating) {
              return res.status(409).send({
                errors: {
                  message: 'You already rated this article',
                }
              });
            }
            return next();
          });
      });
  }

  /**
   * @description Validates request parameters
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   *
   * @return {Function} next
   */
  static modifyRating(req, res, next) {
    const { ratingId, slug } = req.params;

    const data = { ratingId };

    const rules = {
      ratingId: 'numeric'
    };

    const validation = new Validator(data, rules);

    if (!validation.passes()) {
      return res.status(400).json({
        errors: validation.errors.all()
      });
    }

    return Article.findOne({
      where: {
        slug
      },
      attributes: ['id']
    })
      .then((article) => {
        if (!article) {
          return res.status(404).json({
            errors: {
              message: 'Article not found'
            }
          });
        }
        req.articleId = article.id;

        Rating
          .findOne({
            where: {
              id: req.params.ratingId,
              userId: req.decoded.userId
            }
          })
          .then((rating) => {
            if (!rating) {
              return res.status(403).send({
                errors: {
                  message: 'Access denied.',
                }
              });
            }
            return next();
          });
      });
  }
}

export default RatingsValidation;
