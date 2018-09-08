import { Op } from 'sequelize';
import db from '../database/models';

const {
  Comment,
  CommentThread,
  User
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
        User.findById(reply.userId, {
          attributes: ['username', 'bio', 'image']
        })
          .then((user) => {
            const {
              id, createdAt, updatedAt, body
            } = reply;
            return res.status(201).json({
              reply: {
                id,
                createdAt,
                updatedAt,
                body,
                user
              }
            });
          })
          .catch(next);
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
        },
        include: { model: User, attributes: ['username', 'bio', 'image'] },
      })
        .then((reply) => {
          if (!reply) {
            return res.status(404).json({
              message: 'Reply does not exist'
            });
          }

          if (reply.userId !== req.decoded.userId) {
            return res.status(403).json({
              message: 'You are not authorized to continue'
            });
          }

          reply.update({
            body: replyBody.trim(),
          });
          const {
            id: replyId, createdAt, updatedAt, body, User: author
          } = reply;
          return res.status(200).json({
            reply: {
              id: replyId,
              createdAt,
              updatedAt,
              body,
              user: author
            }
          });
        }).catch(next);
    }).catch(next);
  }

  /**
   * @description get a reply for a comment
   *
   * @param {Object} req - HTTP Request
   * @param {Object} res - HTTP Response
   * @param {*} next - Next function
   *
   * @return {Object} Returned object
   */
  static getReply(req, res, next) {
    const { commentId, id } = req.params;
    Comment.find({
      where: {
        id: {
          [Op.eq]: commentId
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
          commentId: {
            [Op.eq]: comment.id
          }
        },
        include: { model: User, attributes: ['username', 'bio', 'image'] },
      }).then((reply) => {
        if (!reply) {
          return res.status(404).json({
            message: 'Reply does not exist',
          });
        }

        if (comment.id === reply.commentId) {
          const {
            id: replyId, createdAt, updatedAt, body, User: author
          } = reply;
          return res.status(200).json({
            reply: {
              id: replyId,
              createdAt,
              updatedAt,
              body,
              user: author,
            }
          });
        }
      })
        .catch(next);
    })
      .catch(next);
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
        include: { model: User, attributes: ['username', 'bio', 'image'] },
      }).then((replies) => {
        if (replies.count < 1) {
          return res.status(404).json({
            message: 'There are no replies for this comment',
            replies: []
          });
        }

        return res.status(200).json({
          replies: replies.rows,
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
            message: 'You are not authorized to continue'
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
