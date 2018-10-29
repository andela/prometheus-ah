import { Op } from 'sequelize';
import db from '../database/models/index';
import ReadingTime from '../utils/ReadingTime';

const {
  Article,
  Tag,
  Follow,
  User,
  Bookmark,
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
      title, body, description, tagList, status
    } = req.body;
    const readingTime = ReadingTime.wordCount(body);

    const { userId } = req.decoded;

    Article.create({
      title,
      body,
      description,
      userId,
      readingTime,
      status
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

    let whereClause = {
      status: {
        [Op.eq]: 'publish'
      }
    };
    const queryBuilder = {
      include: [{
        model: User,
        attributes:
         {
           exclude: [
             'password',
             'socialLogin',
             'socialLoginType',
             'createdAt',
             'updatedAt',
             'hash',
             'verify_hash_expiration',
             'reset_password_hash',
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
      whereClause = {
        ...whereClause,
        title: {
          [Op.iLike]: `%${req.query.title}%`
        }
      };
    }

    if (user && !req.decoded) {
      queryBuilder.include[0].where = {
        username: {
          [Op.iLike]: `%${req.query.user}%`
        }
      };
    }

    if (user && req.decoded) {
      if (user && (req.decoded.username === req.query.user)) {
        queryBuilder.include[0].where = {
          username: {
            [Op.eq]: `%${req.query.user}%`
          }
        };
        queryBuilder.where = {
          status: {
            [Op.or]: ['publish', 'draft', 'block']
          }
        };
      } else {
        queryBuilder.include[0].where = {
          username: {
            [Op.iLike]: `%${req.query.user}%`
          }
        };
      }
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

    queryBuilder.where = whereClause;

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
        },
        {
          model: User,
          attributes: [
            'id',
            'email',
            'username',
            'firstname',
            'lastname',
            'image',
            'bio'
          ],
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
      title, body, description, tagList, status
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
    if (title || body || description || tagList || status) {
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
      where: {
        status: 'publish'
      },
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

  /**
   * @param {obj} req
   * @param {obj} res
   * @param {obj} next
   * @returns {json} getFeaturedArticles
   */
  static getFeaturedArticles(req, res, next) {
    const featuredArticles = [
      process.env.FT_ARTICLE_1,
      process.env.FT_ARTICLE_2,
      process.env.FT_ARTICLE_3,
      process.env.FT_ARTICLE_4,
      process.env.FT_ARTICLE_5
    ];

    Article.findAll({
      where: {
        slug: {
          [Op.in]: featuredArticles
        },
        status: {
          [Op.eq]: 'publish'
        }
      },
      include: [{
        model: User,
        attributes: ['username', 'firstname', 'lastname'],
      },
      {
        model: Tag,
        attributes: ['name'],
        through: {
          attributes: []
        }
      }]
    })
      .then((articles) => {
        const foundArticlesSlug = articles.map(article => article.slug);
        const notFound = featuredArticles.filter((slug) => {
          if (foundArticlesSlug.includes(slug)) {
            return;
          }
          return slug;
        });

        if (notFound.length > 0) {
          return res.status(404).json({
            message: `The articles with the slug ${notFound} were not found`
          });
        }

        return res.status(200).json({ articles });
      })
      .catch(next);
  }
}

export default ArticlesController;
