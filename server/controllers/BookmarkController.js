import db from '../database/models/index';

const { Bookmark } = db;

/**
 * @param {param} req
 * @param {param} res
 * @param {func} next
 */
class BookmarkController {
  /**
 * @param {obj} req
 * @param {obj} res
 * @param {obj} next
 * @returns {json} bookmark article
 */
  static bookmarkArticle(req, res, next) {
    const { articleId } = req;
    const { userId } = req.decoded;

    Bookmark.findOne({
      where: {
        articleId,
        userId
      }
    })
      .then((bookmark) => {
        if (bookmark) {
          return res.status(200).json({
            message: 'You have already bookmarked this article'
          });
        }
        Bookmark.create({
          articleId,
          userId
        })
          .then((data) => {
            res.status(201).json({
              message: 'Article bookmarked successfuly',
              data
            });
          })
          .catch(next);
      });
  }

  /**
 * @param {obj} req
 * @param {obj} res
 * @param {obj} next
 * @returns {json} delet bookmark
 */
  static deleteBookmark(req, res, next) {
    const { articleId } = req;

    Bookmark.findOne({
      where: {
        articleId,
        userId: req.decoded.userId
      }
    })
      .then((bookmark) => {
        if (!bookmark) {
          return res.status(404).json({
            message: 'You did not bookmark this article'
          });
        }
        bookmark.destroy()
          .then(() => {
            res.status(200).json({
              message: 'Bookmark removed successfully'
            });
          });
      })
      .catch(next);
  }
}

export default BookmarkController;
