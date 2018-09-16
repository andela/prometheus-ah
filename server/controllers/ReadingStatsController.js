import { Op } from 'sequelize';
import db from '../database/models/index';

const {
  User, ReadView, Article,
} = db;
/**
 *
 * @description controller class with methods for getting users stats
 * @class RedingStatsController
 */
class ReadingStatsController {
  /**
   * @description Get all stats
   * @param  {object} req body of the user's request
   * @param  {function} res response from the server
   * @param  {function} next response from the server
   * @returns {object} The body of the response message
   * @memberof ReadingStatsController
   */
  static getAllStats(req, res, next) {
    const id = req.decoded.userId;
    const query = req.query.bound;
    const boundary = {
      day: new Date() - 60 * 60 * 24 * 1000,
      week: new Date() - 60 * 60 * 24 * 7 * 1000,
      month: new Date() - 60 * 60 * 24 * 7 * 4 * 1000
    };
    const option = !query || query === 'default'
      ? {}
      : { where: { createdAt: { [Op.between]: [new Date(boundary[query]), new Date()] } } };
    const readArticles = [];
    return User.findById(id)
      .then(user => user.getReadViews(option)
        .then(readViews => readViews.map(readView => readView.dataValues.articleId))
        .then(articleIds => Article.findAll()
          .then((articles) => {
            articles.forEach((article) => {
              if (articleIds.includes(article.dataValues.id)) {
                readArticles.push(article.dataValues);
              }
            });
          }))
        .then(() => res.status(200).json({
          message: 'Articles read by you',
          numberOfArticlesRead: readArticles.length,
          readArticles,
        })))
      .catch(next);
  }

  /**
   * @description Get all categories
   * @param  {object} req body of the user's request
   * @param  {function} res response from the server
   * @param  {function} next response from the server
   * @returns {object} The body of the response message
   * @param  {string} articleId body of the user's request
   * @memberof ReadingStatsController
   */
  static saveViewed(req, res, next) {
    const { articleId, userId } = req.storage;
    return ReadView.findOne({
      where: {
        [Op.and]: [
          { articleId }, { userId },
        ]
      },
    })
      .then((readView) => {
        if (readView) return null;
        return ReadView.create({
          articleId, userId,
        });
      })
      .catch(next);
  }
}

export default ReadingStatsController;
