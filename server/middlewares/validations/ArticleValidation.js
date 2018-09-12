import Validator from 'validatorjs';

/**
 * @class Authenticate
 */
class ArticleValidation {
  /**
 * @description it authenticates the value a user passed
 *
 * @return {void}
 *
 * @param {param} req
 * @param {param} res
 * @param {func} next
 */
  static createArticle(req, res, next) {
    const {
      title,
      body,
      description
    } = req.body;

    const data = {
      title,
      body,
      description
    };

    const rules = {
      title: 'required|min:3',
      body: 'required|min:8',
      description: 'required|min:3|max:50'
    };

    const validation = new Validator(data, rules);

    if (validation.passes()) {
      return next();
    }
    return res.status(400).json({
      errors: validation.errors.all()
    });
  }
}

export default ArticleValidation;
