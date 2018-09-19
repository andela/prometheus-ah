import Validator from 'validatorjs';

/**
 * @class NotificationValidation
 */
class NotificationValidation {
  /**
   * validate notification body
   *
   * @param {object} req
   * @param {object} res
   * @param {func} next
   *
   * @return {void}
   */
  static validateNotificationBody(req, res, next) {
    const { articleSlug, userId } = req.body;

    const data = {
      articleSlug,
      userId,
    };

    const rules = {
      articleSlug: 'required',
      userId: 'required',
    };

    const message = {
      'required.articleSlug': ':attribute field cannot be empty',
      'required.userId': ':attribute field cannot be empty',
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
   * validate notification status body
   *
   * @param {object} req
   * @param {object} res
   * @param {func} next
   *
   * @return {void}
   */
  static validateNotificationStatus(req, res, next) {
    const { status } = req.body.notification;

    const data = {
      status
    };

    const rules = {
      status: ['required', { in: ['on', 'off'] }]
    };

    const message = {
      'in.status': ':attribute field must be on or off'
    };

    const validation = new Validator(data, rules, message);

    if (validation.passes()) {
      return next();
    }

    return res.status(400).json({
      errors: validation.errors.first('status'),
    });
  }
}

export default NotificationValidation;
