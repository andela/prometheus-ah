/* eslint-disable class-methods-use-this */
import { Op } from 'sequelize';
import db from '../database/models';
import NotificationsController from './NotificationsController';

const {
  Article,
  Comment,
} = db;

/**
 * @class CommentsControllers
 */
class CommentsControllers {
  /**
   * @description Create a comment for an article
   *
   * @param {Object} req - HTTP Request
   * @param {Object} res - HTTP Response
   * @param {*} next - Next function
   *
   * @return {Object} Returned object
   */
  static createComment(req, res, next) {
    const {
      body: commentBody
    } = req.body.comment;

    Article.find({
      where: {
        slug: {
          [Op.eq]: req.params.slug,
        }
      }
    }).then((article) => {
      if (!article) {
        return res.status(404).json({
          message: 'Article does not exist'
        });
      }

      Comment.create({
        articleId: article.id,
        userId: req.decoded.userId,
        body: commentBody.trim()
      }).then((comment) => {
        const {
          id, createdAt, updatedAt, body
        } = comment;

        const notificationData = {
          userId: article.userId,
          articleSlug: article.slug,
          commentId: id,
          createdBy: req.decoded.username,
          status: 'unread',
          type: 'COMMENT_CREATED'
        };

        if (req.decoded.userId !== article.userId) {
          NotificationsController.saveNotification(notificationData, next);
        }

        return res.status(201).json({
          comment: {
            id, createdAt, updatedAt, body, user: req.decoded
          }
        });
      })
        .catch(next);
    })
      .catch(next);
  }

  /**
   * @description Update a comment for an article
   *
   * @param {Object} req - HTTP Request
   * @param {Object} res - HTTP Response
   * @param {*} next - Next function
   *
   * @return {Object} Returned object
   */
  static updateComment(req, res, next) {
    const {
      body: commentBody
    } = req.body.comment;
    const { id } = req.params;

    Article.find({
      where: {
        slug: {
          [Op.eq]: req.params.slug,
        }
      }
    }).then((article) => {
      if (!article) {
        return res.status(404).json({
          message: 'Article does not exist'
        });
      }

      Comment.find({
        where: {
          id: {
            [Op.eq]: id,
          },
          articleId: {
            [Op.eq]: article.id
          }
        },
      })
        .then((comment) => {
          if (!comment) {
            return res.status(404).json({
              message: 'Comment does not exist'
            });
          }

          if (comment.userId !== req.decoded.userId) {
            return res.status(403).json({
              message: 'Access denied.'
            });
          }

          comment.update({
            body: commentBody.trim(),
          });
          const {
            id: commentId, createdAt, updatedAt, body,
          } = comment;
          return res.status(201).json({
            comment: {
              id: commentId,
              createdAt,
              updatedAt,
              body,
              user: req.decoded
            }
          });
        }).catch(next);
    }).catch(next);
  }

  /**
   * @description get all comments for an article
   *
   * @param {Object} req - HTTP Request
   * @param {Object} res - HTTP Response
   * @param {*} next - Next function
   *
   * @return {Object} Returned object
   */
  static getAllComments(req, res, next) {
    const page = parseInt((req.query.page), 10);
    const limit = parseInt((req.query.limit), 10);
    const offset = parseInt((page - 1), 10) * limit;

    Article.find({
      where: {
        slug: {
          [Op.eq]: req.params.slug
        }
      }
    }).then((article) => {
      if (!article) {
        return res.status(404).json({
          message: 'Article does not exist',
        });
      }

      Comment.findAndCountAll({
        where: {
          articleId: {
            [Op.eq]: article.id,
          },
        },
        order: ['id'],
        attributes: ['id', 'createdAt', 'updatedAt', 'body'],
        offset,
        limit
      }).then((comments) => {
        const { count } = comments;
        const pageCount = Math.ceil(count / limit);

        return res.status(200).json({
          paginationMeta: {
            currentPage: page,
            pageSize: limit,
            totalCount: count,
            resultCount: comments.rows.length,
            pageCount,
          },
          comments: {
            ...comments.rows,
            user: req.decoded
          },
          commentsCount: count,
        });
      })
        .catch(next);
    })
      .catch(next);
  }

  /**
   * @description delete comments for an article
   *
   * @param {Object} req - HTTP Request
   * @param {Object} res - HTTP Response
   * @param {*} next - Next function
   *
   * @return {Object} Returned object
   */
  static deleteComment(req, res, next) {
    Article.find({
      where: {
        slug: {
          [Op.eq]: req.params.slug
        }
      }
    }).then((article) => {
      if (!article) {
        return res.status(404).json({
          message: 'Article does not exist'
        });
      }

      Comment.find({
        where: {
          id: {
            [Op.eq]: req.params.id
          },
          articleId: {
            [Op.eq]: article.id
          }
        }
      }).then((comment) => {
        if (!comment) {
          return res.status(404).json({
            message: 'Comment does not exist',
          });
        }

        if (comment.userId !== req.decoded.userId) {
          return res.status(403).json({
            message: 'Access denied.'
          });
        }

        comment.destroy();
        return res.status(200).json({
          message: 'Comment was deleted successfully',
        });
      }).catch(next);
    }).catch(next);
  }
}

export default CommentsControllers;
