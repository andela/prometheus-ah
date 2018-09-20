import db from '../database/models';

const { Article, Rating } = db;

/**
 * @class RatingsController
 *
 * @export {class}
 */
class RatingsController {
  /**
   * @description - Create New Rating
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @param {object} next call next funtion/handler
   *
   * @memberOf RatingsController
   *
   * @returns {object} response JSON Object
   */
  static createRating(req, res, next) {
    return Rating
      .create({
        rating: req.body.rating,
        userId: req.decoded.userId,
        articleId: req.articleId
      })
      .then((newRating) => {
        res.status(201).send({
          ratings: {
            rating: newRating.rating,
            articleId: newRating.articleId
          }
        });
      })
      .catch(next);
  }

  /**
   * @description - Get All Ratings For a Specific Article
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @param {object} next call next funtion/handler
   *
   * @memberOf RatingsController
   *
   * @returns {object} response - Paginated Article Ratings JSON Object
   */
  static getRatings(req, res, next) {
    const { page, limit, order } = req.query;
    const offset = parseInt((page - 1), 10) * limit;
    let averageRating = 0;
    const { slug } = req.params;
    return Article.findOne({
      where: {
        slug
      },
      attributes: ['id']
    })
      .then(() => {
        Rating
          .findAndCountAll({
            where: {
              articleId: req.articleId,
            },
            order: [
              ['createdAt', order]
            ],
            offset,
            limit,
          })
          .then((ratings) => {
            const { count } = ratings;
            const pageCount = Math.ceil(count / limit);
            Rating.sum('rating', {
              where: {
                articleId: req.articleId
              }
            }).then((sum) => {
              averageRating = sum / count;
              return res.status(200).json({
                message: 'Article ratings successfully retrieved',
                average: averageRating.toFixed(2),
                paginationMeta: {
                  pageCount,
                  totalCount: count,
                  outputCount: ratings.rows.length,
                  pageSize: limit,
                  currentPage: page,
                },
                ratings: ratings.rows,
              });
            });
          });
      })
      .catch(next);
  }

  /**
   * @description - Update Rating
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @param {object} next call next funtion/handler
   *
   * @memberOf RatingsController
   *
   * @returns {object} response JSON Object
   */
  static updateRating(req, res, next) {
    return Rating
      .findById(req.params.ratingId)
      .then(rating => rating
        .update({
          rating: req.body.rating,
        })
        .then(newRating => res.status(200).send({
          ratings: {
            rating: newRating.rating,
            articleId: newRating.articleId
          }
        })))
      .catch(next);
  }

  /**
   * @description - Delete Rating
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @param {object} next call next funtion/handler
   *
   * @memberOf RatingsController
   *
   * @returns {object} response JSON Object
   */
  static deleteRating(req, res, next) {
    return Rating
      .findById(req.params.ratingId)
      .then(rating => rating
        .destroy()
        .then(() => res.status(200).send({
          message: 'Rating has been removed',
        })))
      .catch(next);
  }
}

export default RatingsController;
