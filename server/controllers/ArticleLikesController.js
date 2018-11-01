import { Op } from 'sequelize';
import db from '../database/models';

const { Article, Likes, User } = db;
/**
 * @description
 * this class contains static methods for
 * like and dislike of an article
 * @class LikeController
 * @return {object} when the class is called with new
 *it returns an instance of the class, but it's never used.
 */
class LikeController {
/**
   * This is a middleware function, it is called when the user wants
   * to like an article.
   * @param {object} req it contains the user's request
   * @param {object} res it is used to send a response to the user
   * @param {function} next is called when there is an error occurs
   * @returns {void} does not return a value
   */
  static likeArticle(req, res, next) {
    const { slug } = req.params;
    const { userId } = req.decoded;

    Article.findOne({
      where: { slug },
    }).then((article) => {
      if (!article) {
        return res.status(404).json({
          error: {
            message: 'Article does not exist',
          },
        });
      }
      return Likes.findOrCreate({
        where: { articleId: article.id, userId },
        defaults: {
          articleId: article.id, userId,
        },
      })
        .then(([likeObject, created]) => {
          if (created) {
            return res.status(201).json({
              message: 'Successfully liked',
              liked: likeObject.dataValues,
            });
          }
          return Likes.update({
            like: true,
          }, {
            where: {
              articleId: article.id, userId,
            }
          })
            .then(likeObject2 => res.status(200).json({
              message: 'Successfully liked',
              liked: likeObject2.dataValues,
            }));
        });
    }).catch(next);
  }

  /**
   * This unlikes an article specified in the request.
   * @param {object} req an object containing the request made to the server
   * @param {object} res this object is used to send a response to the user
   * @param {Function} next  called when an error occurs
   * @returns {void} does not return a value
   */
  static dislikeArticle(req, res, next) {
    const { slug } = req.params;
    const { userId } = req.decoded;
    Article.findOne({
      where: { slug },
    }).then((article) => {
      if (!article) {
        return res.status(404).json({
          error: {
            message: 'article not found',
          }
        });
      }
      return Likes.findOrCreate({
        where: { articleId: article.id, userId },
        defaults: { articleId: article.id, userId, likeStatus: false, },
      })
        .then(([disLikedObject, created]) => {
          if (created) {
            return res.status(201).json({
              message: 'Successfully disliked',
              dislike: disLikedObject,
            });
          }
          return Likes.update({
            likeStatus: false,
          }, {
            where: {
              articleId: article.id, userId,
            }
          })
            .then(likeObject2 => res.status(200).json({
              message: 'Successfully disliked',
              disliked: likeObject2.dataValues,
            }));
        });
    })
      .catch(next);
  }

  /**
   * This is a middleware function, it is called when the user wants
   * to unlike an article.
   * @param {object} req it contains the user's request
   * @param {object} res it is used to send a response to the user
   * @param {function} next is called when there is an error occurs
   * @returns {void} does not return a value
   */
  static unlikeArticle(req, res, next) {
    const { slug } = req.params;
    const { userId } = req.decoded;

    Likes.findOne({
      where: { userId },
    })
      .then((likes) => {
        if (!likes) {
          return res.status(404).json({
            error: {
              message: 'Have not liked or disliked before',
            },
          });
        }
        likes.destroy();

        return res.status(200).json({
          slug,
          message: 'unliked successfully'
        });
      }).catch(next);
  }

  /**
   *
   * This method retrieves information of all the
   * likes of a particular article from the database.
   * @param {object} req contians the request informations
   * sent to the server
   * @param {object} res used to send a response back to the
   * client
   * @param {object} next called  when an error occurs while
   * querying the database
   * @returns {void} does not return a value to the user
   */
  static totalLikes(req, res, next) {
    const { page, limit } = req.query;
    const offset = parseInt((page - 1), 10) * limit;
    const { slug } = req.params;
    const usersLiked = [];
    Article.findOne({
      where: { slug },
    }).then((article) => {
      if (!article) {
        return res.status(404).json({
          error: {
            message: 'article not found',
          },
        });
      }
      Likes.findAndCountAll({
        where: { articleId: { [Op.eq]: article.id }, likeStatus: { [Op.eq]: true } },
        include: [{ model: User, as: 'user', attributes: ['username'] }],
        attributes: { exclude: ['id', 'userId', 'createdAt', 'updatedAt'] },
        offset,
        limit,
      }).then((totalLikes) => {
        const { count } = totalLikes;
        const userlist = totalLikes.rows;
        const outputCount = userlist.length;
        const pageCount = Math.ceil(count / limit);
        userlist.forEach((totalLiked) => {
          if (totalLiked.dataValues.likeStatus === true) {
            usersLiked.push(totalLiked.dataValues.user.dataValues.username);
          }
        });
        return res.status(200).json({
          paginationMeta: {
            currentPage: page,
            pageSize: limit,
            totalCount: count,
            outputCount,
            pageCount,
          },
          slug,
          usersLiked,
        });
      });
    }).catch(next);
  }

  /**
   *
   * This method retrieves information of all the
   * dislikes of a particular article from the database.
   * @param {object} req contians the request informations
   * sent to the server
   * @param {object} res used to send a response back to the
   * client
   * @param {object} next called  when an error occurs while
   * querying the database
   * @returns {void} does not return a value to the user
   */
  static totalDislikes(req, res, next) {
    const { page, limit } = req.query;
    const offset = parseInt((page - 1), 10) * limit;
    const { slug } = req.params;
    const usersDisliked = [];
    Article.findOne({
      where: { slug },
    }).then((article) => {
      if (!article) {
        return res.status(404).json({
          error: {
            message: 'article not found',
          },
        });
      }
      Likes.findAndCountAll({
        where: { articleId: { [Op.eq]: article.id }, likeStatus: { [Op.eq]: false } },
        include: [{ model: User, as: 'user', attributes: ['username'] }],
        attributes: { exclude: ['id', 'userId', 'createdAt', 'updatedAt'] },
        offset,
        limit,
      }).then((totalDislikes) => {
        const { count } = totalDislikes;
        const userlist = totalDislikes.rows;
        const outputCount = userlist.length;
        const pageCount = Math.ceil(count / limit);
        userlist.forEach((totalDisliked) => {
          if (totalDisliked.dataValues.likeStatus === false) {
            usersDisliked.push(totalDisliked.dataValues.user.dataValues.username);
          }
        });
        return res.status(200).json({
          paginationMeta: {
            currentPage: page,
            pageSize: limit,
            totalCount: count,
            outputCount,
            pageCount,
          },
          slug,
          usersDisliked,
        });
      });
    }).catch(next);
  }

  /**
   * This returns a boolean after checking if a user has liked an article.
   * @param {object} req an object containing the request made to the server
   * @param {object} res this object is used to send a response to the user
   * @param {Function} next  called when an error occurs
   * @returns {void} does not return a value
   */
  static likeStatus(req, res, next) {
    Article.findOne({
      where: {
        slug: req.params.slug
      }
    })
      .then((article) => {
        if (!article) {
          return res.status(404).json({
            message: 'Article not found'
          });
        }
        if (req.decoded) {
          return Likes.findOne({
            where: {
              userId: req.decoded.userId,
              articleId: article.id
            }
          })
            .then((userLikes) => {
              if (userLikes) {
                res.status(200).json({
                  userLikes: true
                });
              } else {
                res.status(200).json({
                  userLikes: false
                });
              }
            });
        }
      })
      .catch(next);
  }
}

export default LikeController;
