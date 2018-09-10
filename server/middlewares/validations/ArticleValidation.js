import Validator from 'validatorjs';

/**
 * @class Authenticate
 */
class ArticleValidation {
  /**
 * @description validate create articles input
 *
 * @return {void}
 *
 * @param {param} req
 * @param {param} res
 * @param {func} next
 */
  static createArticle(req, res, next) {
    const rules = {
      title: 'required|min:3',
      body: 'required|min:8',
      description: 'required|min:3|max:50'
    };

    const validation = new Validator(req.body, rules);

    if (validation.passes()) {
      return next();
    }
    return res.status(400).json({
      errors: validation.errors.all()
    });
  }

  /**
 * @description validate update articles input
 *
 * @return {void}
 *
 * @param {param} req
 * @param {param} res
 * @param {func} next
 */
  static updateArticle(req, res, next) {
    const rules = {
      title: 'min:3',
      body: 'min:8',
      description: 'min:3|max:50'
    };

    const validation = new Validator(req.body, rules);

    if (validation.passes()) {
      return next();
    }
    return res.status(400).json({
      errors: validation.errors.all()
    });
  }
}

export default ArticleValidation;
