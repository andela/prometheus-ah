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
    const articleSlug = req.params.slug;

    const { userId } = req.decoded;

    Bookmark.findOne({
      where: {
        articleSlug,
        userId
      }
    })
      .then((bookmark) => {
        if (bookmark) {
          bookmark.destroy();
          return res.status(200).json({
            message: 'Bookmark removed successfully'
          });
        }
        Bookmark.create({
          articleSlug,
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
 * @returns {json} get list of bookmarks
 */
  static getBookmarks(req, res, next) {
    const page = parseInt((req.query.page || 1), 10);
    const limit = parseInt((req.query.limit || 10), 10);
    const offset = parseInt((page - 1), 10) * limit;

    Bookmark.findAndCountAll({
      where: {
        userId: req.decoded.userId
      },
      offset,
      limit
    })
      .then((bookmark) => {
        const { count } = bookmark;
        const pageCount = Math.ceil(count / limit);
        return res.status(200).json({
          paginationMeta: {
            pageCount,
            totalCount: count,
            outputCount: bookmark.rows.length,
            pageSize: limit,
            currentPage: page,
          },
          bookmark: bookmark.rows
        });
      })
      .catch(next);
  }
}

export default BookmarkController;
