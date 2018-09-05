import Validator from 'validatorjs';

/**
 * @class CommentValidation
 */
class CommentValidation {
  /**
   * @description validate comment input
   *
   * @param {object} req
   * @param {object} res
   * @param {func} next
   *
   * @return {void}
   */
  static commentValidate(req, res, next) {
    const { body } = req.body.comment || req.body.reply;

    const data = {
      body,
    };

    const rules = {
      body: 'required|max:600',
    };

    const message = {
      'required.body': ':attribute field cannot be empty',
      'max.body': 'The :attribute is too long. Max length is :max characters.',
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
   * @description validate id for comment
   *
   * @param {object} req
   * @param {object} res
   * @param {func} next
   *
   * @return {void}
   */
  static validateId(req, res, next) {
    const { id } = req.params;

    Validator.register(
      'positiveInt', value => value > 0,
      'The comment :attribute must be a positive integer',
    );

    const validation = new Validator({
      id,
    }, {
      id: 'required|integer|positiveInt',
    }, {
      'integer.id': 'The comment :attribute must be an integer',
    });

    if (validation.passes()) {
      return next();
    }

    return res.status(400).json({
      errors: validation.errors.first('id'),
    });
  }

  /**
   * @description validate id for comment
   *
   * @param {object} req
   * @param {object} res
   * @param {func} next
   *
   * @return {void}
   */
  static validatethreadIds(req, res, next) {
    const { id, commentId } = req.params;

    Validator.register(
      'positiveInt', value => value > 0,
      'The comment id must be a positive integer',
    );

    const validation = new Validator({
      id,
      commentId
    }, {
      id: 'required|integer|positiveInt',
      commentId: 'required|integer|positiveInt'
    }, {
      'integer.id': 'The reply :attribute must be an integer',
      'integer.commentId': 'The comment id must be an integer',
    });

    if (validation.passes()) {
      return next();
    }

    return res.status(400).json({
      errors: validation.errors.all(),
    });
  }
}

export default CommentValidation;
