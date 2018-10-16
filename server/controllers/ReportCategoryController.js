import db from '../database/models';

const { ReportCategory } = db;

/**
 * @class ReportCategoryController
 *
 * @export {class}
 */
class ReportCategoryController {
  /**
   * @description - Create New ReportCategory
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @param {object} next call next funtion/handler
   *
   * @memberOf ReportCategoryController
   *
   * @returns {object} response JSON Object
   */
  static createReportCategory(req, res, next) {
    const { title, description } = req.body;

    return ReportCategory.findOne({
      where: {
        title
      },
    })
      .then((reportCategory) => {
        if (reportCategory) {
          return res.status(409).json({
            message: 'This report category already exist.'
          });
        }
        ReportCategory
          .create({
            title,
            description,
          })
          .then((newReportCategory) => {
            res.status(201).json({
              reportCategory: {
                message: 'New category created successfully',
                id: newReportCategory.id,
                title: newReportCategory.title,
                description: newReportCategory.description
              }
            });
          })
          .catch(next);
      });
  }

  /**
   * @description - Get a Specific ReportCategory
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @param {object} next call next funtion/handler
   *
   * @memberOf ReportCategoryController
   *
   * @returns {object} response JSON Object
   */
  static getReportCategory(req, res, next) {
    ReportCategory.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['title', 'description']
    })
      .then((reportCategory) => {
        if (!reportCategory) {
          return res.status(404).json({
            message: 'Report category not found'
          });
        }
        return res.status(200).json({
          reportCategory: {
            title: reportCategory.title,
            description: reportCategory.description,
          }
        });
      })
      .catch(next);
  }

  /**
   * @description - Get All ReportCategories For a Specific Article
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @param {object} next call next funtion/handler
   *
   * @memberOf ReportCategoryController
   *
   * @returns {object} response JSON Object
   */
  static getReportCategories(req, res, next) {
    return ReportCategory
      .findAll({
        order: [
          ['createdAt']
        ]
      })
      .then((reportCategories) => {
        res.status(200).json({
          reportCategories: {
            ...reportCategories,
          }
        });
      })
      .catch(next);
  }

  /**
   * @description - Update a Specific ReportCategory
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @param {object} next call next funtion/handler
   *
   * @memberOf ReportCategoryController
   *
   * @returns {object} response JSON Object
   */
  static updateReportCategory(req, res, next) {
    const { title, description } = req.body;
    return ReportCategory
      .findOne({
        where: {
          id: req.params.id,
        },
        paranoid: true
      })
      .then((reportCategory) => {
        if (!reportCategory) {
          return res.status(404).json({
            message: 'Report category was not found.'
          });
        }
        reportCategory
          .update({
            title,
            description,
          })
          .then(newReportCategory => res.status(200).json({
            reportCategory: {
              message: 'Report category updated successfully',
              id: newReportCategory.id,
              title: newReportCategory.title,
              description: newReportCategory.description
            }
          }));
      })
      .catch(next);
  }

  /**
   * @description - Delete a Specific ReportCategory
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @param {object} next call next funtion/handler
   *
   * @memberOf ReportCategoryController
   *
   * @returns {object} response JSON Object
   */
  static deleteReportCategory(req, res, next) {
    return ReportCategory
      .findOne({
        where: {
          id: req.params.id,
        }
      })
      .then((reportCategory) => {
        if (!reportCategory) {
          return res.status(404).json({
            message: 'Report category not found',
          });
        }
        reportCategory
          .destroy()
          .then(() => res.status(200).json({
            message: 'Report category has been deleted',
          }));
      })
      .catch(next);
  }
}

export default ReportCategoryController;
