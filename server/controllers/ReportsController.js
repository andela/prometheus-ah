import db from '../database/models';

const { Article, Report, ReportCategory } = db;

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
   *
   * @memberOf ReportsController
   *
   * @returns {object} response JSON Object
   */
  static createReport(req, res) {
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
            errors: {
              message: 'Article not found'
            }
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
                errors: {
                  message: 'Category not found'
                }
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
                    categoryId,
                    details: newReport.details,
                    status: newReport.status
                  }
                });
              });
          });
      });
  }

  /**
   * @description - Get a Specific Report
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberOf ReportsController
   *
   * @returns {object} response JSON Object
   */
  static getReport(req, res) {
    Report.findOne({
      where: {
        id: req.params.reportId
      },
      include: [{
        model: ReportCategory,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'description']
        }
      }],
    })
      .then((report) => {
        if (!report) {
          return res.status(404).json({
            errors: {
              message: 'Report not found'
            }
          });
        }
        return res.status(200).json({
          report: {
            category: report.ReportCategory.title,
            details: report.details,
            status: report.status
          }
        });
      });
  }

  /**
   * @description - Get All Reports For a Specific Article
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberOf ReportsController
   *
   * @returns {object} response JSON Object
   */
  static getReports(req, res) {
    const { page, limit, order } = req.query;
    const offset = parseInt((page - 1), 10) * limit;

    return Report
      .findAndCountAll({
        order: [
          ['createdAt', order]
        ],
        offset,
        limit,
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
      });
  }

  /**
   * @description - Update a Specific Report
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberOf ReportsController
   *
   * @returns {object} response JSON Object
   */
  static closeReport(req, res) {
    return Report
      .findOne({
        where: {
          id: req.params.reportId,
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
              category: newReport.ReportCategory.title,
              details: newReport.details,
              status: newReport.status
            }
          }));
      });
  }

  /**
   * @description - Delete a Specific Report
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberOf ReportsController
   *
   * @returns {object} response JSON Object
   */
  static deleteReport(req, res) {
    return Report
      .findOne({
        where: {
          id: req.params.reportId,
        }
      })
      .then((report) => {
        if (!report) {
          return res.status(404).send({
            errors: {
              message: 'Report not found',
            }
          });
        }
        report
          .destroy()
          .then(() => res.status(200).send({
            message: 'Report has been deleted',
          }));
      });
  }
}

export default ReportsController;
