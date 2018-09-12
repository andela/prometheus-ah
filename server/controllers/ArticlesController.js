import db from '../database/models/index';
import ReadingTime from '../utils/ReadingTime';

const { Article, Tag } = db;

/**
 * @param {param} req - Request Object
 * @param {param} res - Response Object
 * @param {func} next - Next function
 */
class ArticlesController {
  /**
   * @param {obj} req - Request Object
   * @param {obj} res - Response Object
   * @param {obj} next - Next function
   * @returns {json} createArticles
   */
  static createArticles(req, res, next) {
    const {
      title, body, description, tagList
    } = req.body;
    const readingTime = ReadingTime.wordCount(body);

    const { userId } = req.decoded;

    Article.create({
      title,
      body,
      description,
      userId,
      readingTime
    })
      .then((article) => {
        if (tagList) {
          tagList.forEach(name => Tag.findOrCreate({
            where: { name }
          })
            .spread((tag) => {
              article.addTag(tag);
            })
            .catch(next));
        }
        res.status(201).json({
          message: 'Article created successfully',
          article,
          tags: tagList,
        });
      })
      .catch(next);
  }

  /**
   * @param {obj} req - Request Object
   * @param {obj} res - Response Object
   * @param {obj} next - Next function
   * @returns {json} getArticles
   */
  static getArticles(req, res, next) {
    const { page, limit, order } = req.query;
    const offset = parseInt(page - 1, 10) * limit;

    Article.findAndCountAll({
      include: [
        {
          model: Tag,
          attributes: ['name'],
          through: {
            attributes: []
          }
        }
      ],
      order: [['createdAt', order]],
      offset,
      limit
    })
      .then((article) => {
        const { count } = article;
        const pageCount = Math.ceil(count / limit);
        return res.status(200).json({
          paginationMeta: {
            currentPage: page,
            pageSize: limit,
            totalCount: count,
            resultCount: article.rows.length,
            pageCount
          },
          articles: article.rows
        });
      })
      .catch(next);
  }

  /**
   * @param {obj} req - Request Object
   * @param {obj} res - Response Object
   * @param {obj} next - Next function
   * @returns {json} articles
   */
  static getSingleArticle(req, res, next) {
    Article.findOne({
      include: [
        {
          model: Tag,
          attributes: ['name'],
          through: {
            attributes: []
          }
        }
      ],
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
        return res.status(200).json({
          article
        });
      })
      .catch(next);
  }

  /**
   * @param {obj} req - Request Object
   * @param {obj} res - Response Object
   * @param {obj} next - Next function
   * @returns {json} articles
   */
  static updateArticle(req, res, next) {
    const {
      title, body, description, tagList
    } = req.body;
    const { article } = req;
    if (tagList) {
      article.setTags([]).then(() => {
        tagList.forEach(name => Tag.findOrCreate({
          where: { name }
        })
          .spread((tag) => {
            article.addTag(tag);
          })
          .catch(next));
      })
        .catch(next);
    }
    if (title || body || description || tagList) {
      if (body) {
        req.body.readingTime = ReadingTime.wordCount(body);
      }
      article.update(req.body)
        .then((updateArticle) => {
          updateArticle.getTags()
            .then((retrievedTags) => {
              let tags = [];
              if (!tagList) {
                retrievedTags.forEach((item) => {
                  tags.push(item.dataValues.name);
                });
              } else {
                tags = tagList;
              }
              return res.status(200).json({
                message: 'Article updated successfully',
                article: updateArticle,
                tags
              });
            });
        });
    } else {
      return res.status(400).json({
        message: 'Invalid request sent.'
      });
    }
  }

  /**
   * @param {obj} req - Request Object
   * @param {obj} res - Response Object
   * @param {obj} next - Next function
   * @returns {json} articles
   */
  static deleteArticle(req, res) {
    const { article } = req;
    article.destroy();

    return res.status(200).json({
      message: 'Article deleted successfully'
    });
  }
}

export default ArticlesController;
