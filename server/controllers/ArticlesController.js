import { Op } from 'sequelize';
import db from '../database/models/index';
import ReadingTime from '../utils/ReadingTime';

const {
  Article,
  Tag,
  Follow,
  User,
  Bookmark
} = db;

/**
 * @param {param} req
 * @param {param} res
 * @param {func} next
 */
class ArticlesController {
  /**
 * @param {obj} req
 * @param {obj} res
 * @param {obj} next
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
 * @param {obj} req
 * @param {obj} res
 * @param {obj} next
 * @returns {json} getArticles
 */
  static getArticles(req, res, next) {
    const {
      page, limit, order, user, title, favorite
    } = req.query;
    const offset = parseInt((page - 1), 10) * limit;

    const queryBuilder = {
      include: [{
        model: User,
        attributes:
         {
           exclude: [
             'password',
             'bio',
             'socialLogin',
             'socialLoginType',
             'createdAt',
             'updatedAt',
             'hash',
             'verify_hash_expiration',
             'isVerified'
           ]
         }
      }, {
        model: Tag,
        attributes: ['name'],
        through: {
          attributes: []
        }
      }],
      order: [
        ['createdAt', order]
      ],
      offset,
      limit,
    };

    if (title) {
      queryBuilder.where = {
        title: {
          [Op.iLike]: `%${req.query.title}%`
        }
      };
    }

    if (user) {
      queryBuilder.include[0].where = {
        username: {
          [Op.iLike]: `%${req.query.user}%`
        }
      };
    }

    if (favorite && req.decoded) {
      queryBuilder.include[1] = {
        model: Bookmark,
        where: {
          userId: req.decoded.userId
        },
        attributes: {
          exclude: ['id', 'articleId', 'userId', 'createdAt', 'updatedAt']
        }
      };
    }

    Article.findAndCountAll(queryBuilder)
      .then((article) => {
        const { count } = article;
        const pageCount = Math.ceil(count / limit);
        return res.status(200).json({
          paginationMeta: {
            currentPage: page,
            pageSize: limit,
            totalCount: count,
            resultCount: article.rows.length,
            pageCount,
          },
          articles: article.rows
        });
      })
      .catch(next);
  }

  /**
 * @param {obj} req
 * @param {obj} res
 * @param {obj} next
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
 * @param {obj} req
 * @param {obj} res
 * @param {obj} next
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
 * @param {obj} req
 * @param {obj} res
 * @param {obj} next
 * @returns {json} articles
 */
  static deleteArticle(req, res) {
    const { article } = req;
    article.destroy()
      .then(() => {
        res.status(200).json({
          message: 'Article deleted successfully'
        });
      });
  }

  /**
   * @param {obj} req
   * @param {obj} res
   * @param {obj} next
   * @returns {json} getArticles
   */
  static articleFeed(req, res, next) {
    const { page, limit, order } = req.query;
    const offset = parseInt((page - 1), 10) * limit;

    Article.findAll({
      limit: 10,
      order: [
        ['createdAt', order]
      ],
      include: [{
        model: User,
        attributes: ['username'],
        include: [{
          model: Follow,
          attributes: [],
          where: {
            userId: req.decoded.userId
          },
        }],
      }],
    })
      .then((articles) => {
        const count = articles.length;
        const feedArticles = articles.slice(offset, (offset + limit));
        const pageCount = Math.ceil(count / limit);
        return res.status(200).json({
          paginationMeta: {
            currentPage: page,
            pageSize: limit,
            totalCount: articles.length,
            resultCount: articles.length,
            pageCount,
          },
          articles: feedArticles
        });
      })
      .catch(next);
  }
}

export default ArticlesController;
