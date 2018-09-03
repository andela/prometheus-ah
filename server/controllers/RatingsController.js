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
   *
   * @memberOf RatingsController
   *
   * @returns {object} response JSON Object
   */
  static createRating(req, res) {
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
      });
  }

  /**
   * @description - Get All Ratings For a Specific Article
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberOf RatingsController
   *
   * @returns {object} response - Paginated Article Ratings JSON Object
   */
  static getRatings(req, res) {
    const page = parseInt((req.query.page), 10);
    const limit = parseInt((req.query.limit), 10);
    const offset = parseInt((page - 1), 10) * limit;
    let order = req.query.order || 'ASC';
    order = order.toUpperCase();
    let averageRating = 0;

    if (order !== 'ASC' && order !== 'DESC') {
      return res.status(400).json({
        message: 'order can only be ASC or DESC'
      });
    }
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
              if (ratings.rows.length === 0) {
                return res.status(200).json({
                  message: 'No ratings on this page',
                  ratings: ratings.rows,
                });
              }
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
      });
  }

  /**
   * @description - Update Rating
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberOf RatingsController
   *
   * @returns {object} response JSON Object
   */
  static updateRating(req, res) {
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
        })));
  }

  /**
   * @description - Delete Rating
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberOf RatingsController
   *
   * @returns {object} response JSON Object
   */
  static deleteRating(req, res) {
    return Rating
      .findById(req.params.ratingId)
      .then(rating => rating
        .destroy()
        .then(() => res.status(200).send({
          message: 'Rating has been removed',
        })));
  }
}

export default RatingsController;
