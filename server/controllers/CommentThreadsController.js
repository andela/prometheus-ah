import { Op } from 'sequelize';
import db from '../database/models';

const {
  Comment,
  CommentThread,
} = db;

/**
 * @class CommentThreadsControllers
 */
class CommentThreadsControllers {
  /**
   * @description Create a reply to a comment
   *
   * @param {Object} req - HTTP Request
   * @param {Object} res - HTTP Response
   * @param {*} next - Next function
   *
   * @return {Object} Returned object
   */
  static createReply(req, res, next) {
    const {
      body: replyBody
    } = req.body.reply;

    Comment.find({
      where: {
        id: {
          [Op.eq]: req.params.id,
        }
      }
    }).then((comment) => {
      if (!comment) {
        return res.status(404).json({
          message: 'Comment does not exist'
        });
      }

      CommentThread.create({
        commentId: comment.id,
        userId: req.decoded.userId,
        body: replyBody.trim()
      }).then((reply) => {
        const {
          id, createdAt, updatedAt, body
        } = reply;
        return res.status(201).json({
          reply: {
            id,
            createdAt,
            updatedAt,
            body,
            user: req.decoded
          }
        });
      })
        .catch(next);
    })
      .catch(next);
  }

  /**
   * @description Update a reply to a comment
   *
   * @param {Object} req - HTTP Request
   * @param {Object} res - HTTP Response
   * @param {*} next - Next function
   *
   * @return {Object} Returned object
   */
  static updateReply(req, res, next) {
    const {
      body: replyBody
    } = req.body.reply;
    const { commentId, id } = req.params;

    Comment.find({
      where: {
        id: {
          [Op.eq]: commentId,
        }
      }
    }).then((comment) => {
      if (!comment) {
        return res.status(404).json({
          message: 'Comment does not exist'
        });
      }

      CommentThread.find({
        where: {
          id: {
            [Op.eq]: id,
          },
        }
      })
        .then((reply) => {
          if (!reply) {
            return res.status(404).json({
              message: 'Reply does not exist'
            });
          }

          if (reply.userId !== req.decoded.userId) {
            return res.status(403).json({
              message: 'Access denied.'
            });
          }

          reply.update({
            body: replyBody.trim(),
          });
          const {
            id: replyId, createdAt, updatedAt, body
          } = reply;
          return res.status(200).json({
            reply: {
              id: replyId,
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
  static getAllReplies(req, res, next) {
    const page = parseInt((req.query.page || 1), 10);
    const limit = parseInt((req.query.limit || 10), 10);
    const offset = parseInt((page - 1), 10) * limit;

    Comment.find({
      where: {
        id: {
          [Op.eq]: req.params.id
        }
      }
    }).then((comment) => {
      if (!comment) {
        return res.status(404).json({
          message: 'Comment does not exist'
        });
      }

      CommentThread.findAndCountAll({
        where: {
          commentId: {
            [Op.eq]: comment.id,
          },
        },
        order: ['id'],
        attributes: ['id', 'createdAt', 'updatedAt', 'body'],
        offset,
        limit
      }).then((replies) => {
        const { count } = replies;
        const pageCount = Math.ceil(count / limit);
        if (count < 1) {
          return res.status(404).json({
            message: 'There are no replies for this comment',
            replies: []
          });
        }

        return res.status(200).json({
          paginationMeta: {
            currentPage: page,
            pageSize: limit,
            totalCount: count,
            resultCount: replies.rows.length,
            pageCount,
          },
          replies: {
            ...replies.rows,
            user: req.decoded
          },
          repliesCount: replies.count,
        });
      }).catch(next);
    }).catch(next);
  }

  /**
   * @description delete a reply for a comment
   *
   * @param {Object} req - HTTP Request
   * @param {Object} res - HTTP Response
   * @param {*} next - Next function
   *
   * @return {Object} Returned object
   */
  static deleteReply(req, res, next) {
    Comment.find({
      where: {
        id: {
          [Op.eq]: req.params.commentId
        }
      }
    }).then((comment) => {
      if (!comment) {
        return res.status(404).json({
          message: 'Comment does not exist',
        });
      }

      CommentThread.find({
        where: {
          id: {
            [Op.eq]: req.params.id
          },
          commentId: {
            [Op.eq]: comment.id
          }
        }
      }).then((reply) => {
        if (!reply) {
          return res.status(404).json({
            message: 'Reply does not exist',
          });
        }

        if (reply.userId !== req.decoded.userId) {
          return res.status(403).json({
            message: 'Access denied.'
          });
        }

        reply.destroy();
        return res.status(200).json({
          message: 'Reply was deleted successfully',
        });
      }).catch(next);
    }).catch(next);
  }
}

export default CommentThreadsControllers;
