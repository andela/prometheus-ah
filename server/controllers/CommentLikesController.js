/* eslint-disable class-methods-use-this */
import { Op } from 'sequelize';
import db from '../database/models';

const {
  Comment,
  CommentLike,
  User
} = db;

/**
 * @class CommentLikesController
 */
class CommentLikesController {
  /**
   * @description Create a like for a comment
   *
   * @param {Object} req - HTTP Request
   * @param {Object} res - HTTP Response
   * @param {*} next - Next function
   *
   * @return {Object} Returned object
   */
  static likeComment(req, res, next) {
    const { id } = req.params;
    const { userId } = req.decoded;
    Comment.findOne({
      where: {
        id: {
          [Op.eq]: id,
        }
      }
    }).then((comment) => {
      if (!comment) {
        return res.status(404).json({
          message: 'Comment does not exist'
        });
      }


      CommentLike.findOrCreate({
        where: {
          commentId: {
            [Op.eq]: comment.id
          },
          userId: {
            [Op.eq]: userId
          }
        },
        defaults: { userId, commentId: comment.id }
      }).then(([found, created]) => { // eslint-disable-line
        if (!created) {
          return res.status(400).json({
            message: 'Comment already liked'
          });
        }

        return res.status(200).json({
          commentId: comment.id,
          message: 'Successfully liked'
        });
      }).catch(next);
    }).catch(next);
  }

  /**
   * @description Delete a like for a comment
   *
   * @param {Object} req - HTTP Request
   * @param {Object} res - HTTP Response
   * @param {*} next - Next function
   *
   * @return {Object} Returned object
   */
  static unLikeComment(req, res, next) {
    const { id } = req.params;
    const { userId } = req.decoded;
    Comment.findOne({
      where: {
        id: {
          [Op.eq]: id,
        }
      }
    }).then((comment) => {
      if (!comment) {
        return res.status(404).json({
          message: 'Comment does not exist'
        });
      }


      CommentLike.findOne({
        where: {
          commentId: {
            [Op.eq]: comment.id
          },
          userId: {
            [Op.eq]: userId
          }
        }
      }).then((commentLike) => {
        if (!commentLike) {
          return res.status(400).json({
            commentId: comment.id,
            message: 'Comment has not been liked'
          });
        }

        commentLike.destroy()
          .then(() => res.status(200).json({
            commentId: comment.id,
            message: 'Successfully unliked'
          })).catch(next);
      }).catch(next);
    }).catch(next);
  }

  /**
   * @description Create a like for a comment
   *
   * @param {Object} req - HTTP Request
   * @param {Object} res - HTTP Response
   * @param {*} next - Next function
   *
   * @return {Object} Returned object
   */
  static getLikes(req, res, next) {
    const page = parseInt((req.query.page), 10);
    const limit = parseInt((req.query.limit), 10);
    const offset = parseInt((page - 1), 10) * limit;

    const { id } = req.params;
    Comment.findOne({
      where: {
        id: {
          [Op.eq]: id,
        }
      }
    }).then((comment) => {
      if (!comment) {
        return res.status(404).json({
          message: 'Comment does not exist'
        });
      }

      CommentLike.findAndCountAll({
        where: {
          commentId: {
            [Op.eq]: comment.id
          }
        },
        include: [{ model: User, as: 'user', attributes: ['username'] }],
        attributes: { exclude: ['id', 'userId', 'commentId', 'createdAt', 'updatedAt'] },
        offset,
        limit
      }).then((likes) => {
        const { count } = likes;
        const pageCount = Math.ceil(count / limit);

        return res.status(200).json({
          paginationMeta: {
            currentPage: page,
            pageSize: limit,
            totalCount: count,
            resultCount: likes.rows.length,
            pageCount,
          },
          likes: likes.rows,
          commentId: comment.id,
          likesCount: count,
        });
      }).catch(next);
    }).catch(next);
  }
}

export default CommentLikesController;
