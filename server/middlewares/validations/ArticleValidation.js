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
      description: 'required|min:3|max:300',
      tagList: 'array',
      status: [{ in: ['publish', 'draft'] }]
    };

    const validation = new Validator(req.body, rules);
    if (!req.decoded.isVerified) {
      res.status(403).json({
        message: 'Access denied.'
      });
    } else if (validation.passes()) {
      next();
    } else {
      res.status(400).json({
        errors: validation.errors.all()
      });
    }
  }

  /**
 * @description it authenticates the value a user passes in
 *
 * @return {void}
 *
 * @param {param} req
 * @param {param} res
 * @param {func} next
 */
  static updateArticle(req, res, next) {
    const rules = {
      title: 'required|min:3',
      body: 'required|min:8',
      description: 'required|min:3|max:300',
      tagList: 'array',
      status: [{ in: ['publish', 'draft'] }]
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
 * @description it authenticates the value an admin passes in
 *
 * @return {void}
 *
 * @param {param} req
 * @param {param} res
 * @param {func} next
 */
  static blockArticle(req, res, next) {
    const rules = {
      status: [{ in: ['block'] }]
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
 * @description it authenticates the value an admin passes in
 *
 * @return {void}
 *
 * @param {param} req
 * @param {param} res
 * @param {func} next
 */
  static unblockArticle(req, res, next) {
    const rules = {
      status: [{ in: ['publish'] }]
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
