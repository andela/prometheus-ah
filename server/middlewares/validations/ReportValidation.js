import Validator from 'validatorjs';

/**
 * @class ReportValidation
 */
class ReportValidation {
  /**
   * @description validate report input
   *
   * @param {object} req
   * @param {object} res
   * @param {func} next
   *
   * @return {void}
   */
  static validateReport(req, res, next) {
    const { details, categoryId } = req.body;

    Validator.register(
      'positiveInt', value => value > 0,
      'The comment :attribute must be a positive integer',
    );

    const data = {
      categoryId,
      details,
    };

    const rules = {
      categoryId: 'required|integer|positiveInt',
      details: 'required|max:1000|min:10',
    };

    const message = {
      'required.categoryId': 'The :attribute field is required.',
      'integer.categoryId': 'The :attribute must be an integer.',
      'positiveInt.categoryId': 'The report :attribute must be a positive integer.',
      'required.details': 'The :attribute field is required.',
      'max.details': 'The :attribute is too long. Max length is :max characters.',
      'min.details': 'The :attribute is too short. Min length is :min characters.',
    };

    const validation = new Validator(data, rules, message);

    if (validation.passes()) {
      return next();
    }

    return res.status(400).json({
      errors: validation.errors.all(),
    });
  }

  /**
   * @description validate id for report
   *
   * @param {object} req
   * @param {object} res
   * @param {func} next
   *
   * @return {void}
   */
  static validateId(req, res, next) {
    const { reportId } = req.params;

    Validator.register(
      'positiveInt', value => value > 0,
      'The comment :attribute must be a positive integer',
    );

    const data = {
      reportId,
    };

    const rules = {
      reportId: 'required|integer|positiveInt',
    };

    const message = {
      'required.reportId': 'The :attribute parameter cannot be empty.',
      'integer.reportId': 'The :attribute must be an integer.',
      'positiveInt.reportId': 'The report :attribute must be a positive integer.'
    };

    const validation = new Validator(data, rules, message);

    if (validation.passes()) {
      return next();
    }

    return res.status(400).json({
      errors: validation.errors.first('reportId'),
    });
  }
}

export default ReportValidation;
