import db from '../database/models';

const {
  Article,
  Report,
  ReportCategory,
  User
} = db;

/**
 * @class ReportsController
 *
 * @export {class}
 */
class ReportsController {
  /**
   * @description - Create New Report
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @param {object} next call next funtion/handler
   *
   * @memberOf ReportsController
   *
   * @returns {object} response JSON Object
   */
  static createReport(req, res, next) {
    const { categoryId, details } = req.body;
    const { slug } = req.params;
    Article.findOne({
      where: {
        slug
      },
      attributes: ['id']
    })
      .then((article) => {
        if (!article) {
          return res.status(404).json({
            message: 'Article not found'
          });
        }
        ReportCategory.findOne({
          where: {
            id: categoryId
          },
          attributes: ['title']
        })
          .then((reportCategory) => {
            if (!reportCategory) {
              return res.status(404).json({
                message: 'Category not found'
              });
            }
            Report
              .create({
                status: 'Open',
                categoryId,
                details,
                userId: req.decoded.userId,
                articleId: article.id,
              })
              .then((newReport) => {
                res.status(201).send({
                  report: {
                    message: 'New report created successfully',
                    categoryId,
                    details: newReport.details,
                    status: newReport.status
                  }
                });
              });
          });
      })
      .catch(next);
  }

  /**
   * @description - Get a Specific Report
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @param {object} next call next funtion/handler
   *
   * @memberOf ReportsController
   *
   * @returns {object} response JSON Object
   */
  static getReport(req, res, next) {
    Report.findOne({
      where: {
        id: req.params.id
      },
      include: [{
        model: ReportCategory,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'description']
        }
      }, {
        model: User,
        attributes: ['username', 'email'],
      }
      ],
    })
      .then((report) => {
        if (!report) {
          return res.status(404).json({
            message: 'Report not found',
          });
        }
        return res.status(200).json({
          report: {
            category: report.ReportCategory.title,
            details: report.details,
            status: report.status,
            user: report.User
          }
        });
      })
      .catch(next);
  }

  /**
   * @description - Get All Reports For a Specific Article
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @param {object} next call next funtion/handler
   *
   * @memberOf ReportsController
   *
   * @returns {object} response JSON Object
   */
  static getReports(req, res, next) {
    const { page, limit, order } = req.query;
    const offset = parseInt((page - 1), 10) * limit;

    return Report
      .findAndCountAll({
        order: [
          ['createdAt', order]
        ],
        offset,
        limit,
        include: [{
          model: ReportCategory,
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt', 'description']
          }
        }, {
          model: User,
          attributes: ['username', 'email'],
        }
        ],
      })
      .then((reports) => {
        const { count } = reports;
        const pageCount = Math.ceil(count / limit);
        return res.status(200).json({
          paginationMeta: {
            pageCount,
            totalCount: count,
            outputCount: reports.rows.length,
            pageSize: limit,
            currentPage: page,
          },
          reports: {
            ...reports.rows,
          }
        });
      })
      .catch(next);
  }

  /**
   * @description - Get All UsersReports For a Specific Article
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @param {object} next call next funtion/handler
   *
   * @memberOf ReportsController
   *
   * @returns {object} response JSON Object
   */
  static getUsersReports(req, res, next) {
    const { articleId } = req.params;
    const { order } = req.query;

    return Report
      .findAll({
        where: {
          userId: req.decoded.userId,
          status: 'Open',
          articleId
        },
        order: [
          ['createdAt', order]
        ],
        include: [{
          model: ReportCategory,
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt', 'description']
          }
        }, {
          model: User,
          attributes: ['username', 'email'],
        }
        ],
      })
      .then((reports) => {
        if (reports.length < 1) {
          return res.status(200).json({
            message: 'You haven\'t report this article'
          });
        }
        return res.status(200).json({
          reports: {
            ...reports,
          }
        });
      })
      .catch(next);
  }

  /**
   * @description - Update a Specific Report
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @param {object} next call next funtion/handler
   *
   * @memberOf ReportsController
   *
   * @returns {object} response JSON Object
   */
  static closeReport(req, res, next) {
    return Report
      .findOne({
        where: {
          id: req.params.id,
        },
        include: [{
          model: ReportCategory,
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'description']
          }
        }],
      })
      .then((report) => {
        report
          .update({
            status: 'Closed'
          })
          .then(newReport => res.status(200).send({
            reports: {
              message: 'Closed report successfully',
              category: newReport.ReportCategory.title,
              details: newReport.details,
              status: newReport.status
            }
          }));
      })
      .catch(next);
  }

  /**
   * @description - Delete a Specific Report
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @param {object} next call next funtion/handler
   *
   * @memberOf ReportsController
   *
   * @returns {object} response JSON Object
   */
  static deleteReport(req, res, next) {
    return Report
      .findOne({
        where: {
          id: req.params.id,
        }
      })
      .then((report) => {
        if (!report) {
          return res.status(404).send({
            message: 'Report not found',
          });
        }
        report
          .destroy()
          .then(() => res.status(200).send({
            message: 'Report has been deleted',
          }));
      })
      .catch(next);
  }
}

export default ReportsController;
