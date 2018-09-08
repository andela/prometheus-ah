/* eslint-disable class-methods-use-this */
import { Op } from 'sequelize';
import db from '../database/models';

const {
  Article,
  Comment,
  User
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
        User.findById(comment.userId, {
          attributes: ['username', 'bio', 'image']
        })
          .then((user) => {
            const {
              id, createdAt, updatedAt, body
            } = comment;
            return res.status(201).json({
              comment: {
                id, createdAt, updatedAt, body, user
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
        include: { model: User, attributes: ['username', 'bio', 'image'] },
      })
        .then((comment) => {
          if (!comment) {
            return res.status(404).json({
              message: 'Comment does not exist'
            });
          }

          if (comment.userId !== req.decoded.userId) {
            return res.status(403).json({
              message: 'You are not authorized to continue'
            });
          }

          comment.update({
            body: commentBody.trim(),
          });
          const {
            id: commentId, createdAt, updatedAt, body, User: author
          } = comment;
          return res.status(201).json({
            comment: {
              id: commentId,
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
   * @description get a comment for an article
   *
   * @param {Object} req - HTTP Request
   * @param {Object} res - HTTP Response
   * @param {*} next - Next function
   *
   * @return {Object} Returned object
   */
  static getComment(req, res, next) {
    const { id } = req.params;
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
            [Op.eq]: id,
          },
          articleId: {
            [Op.eq]: article.id
          }
        },
        attributes: ['id', 'articleId', 'createdAt', 'updatedAt', 'body'],
        include: { model: User, attributes: ['username', 'bio', 'image'] },
      }).then((comment) => {
        if (!comment) {
          return res.status(404).json({
            message: 'Comment does not exist'
          });
        }

        if (article.id === comment.articleId) {
          const {
            id: commentId, createdAt, updatedAt, body, User: author
          } = comment;
          return res.status(200).json({
            comment: {
              id: commentId,
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
  static getAllComments(req, res, next) {
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
        include: { model: User, attributes: ['username', 'bio', 'image'] },
      }).then((comments) => {
        if (comments.count < 1) {
          return res.status(404).json({
            message: 'There are no comments for this article',
            comments: []
          });
        }

        return res.status(200).json({
          comments: comments.rows,
          commentsCount: comments.count,
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
            message: 'You are not authorized to continue'
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
