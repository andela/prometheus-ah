import Validator from 'validatorjs';

/**
 * @class QueryValidation
 */
class QueryValidation {
  /**
   * validate query parameters
   *
   * @param {object} req
   * @param {object} res
   * @param {func} next
   *
   * @return {void}
   */
  static queryValidation(req, res, next) {
    const { limit, page } = req.query;
    if (limit < 0 || page <= 0) {
      return res.status(400).json({
        message: 'Invalid query parameter'
      });
    }
    const validation = new Validator({
      limit,
      page
    }, {
      limit: 'numeric',
      page: 'numeric',
    }, {
      'numeric.limit': ':attribute in the query parameter can only be numbers.',
      'numeric.page': ':attribute in the query parameter can only be numbers.',
    });
    if (validation.passes()) {
      return next();
    }
    return res.status(400).json({
      errors: validation.errors.all(),
    });
  }
}

export default QueryValidation;
