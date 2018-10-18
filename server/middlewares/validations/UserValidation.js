import Validator from 'validatorjs';

/**
 * @class UserInputValidation
 */
class UserValidation {
  /**
   * validate user input on signUp
   *
   * @param {object} req
   * @param {object} res
   * @param {func} next
   *
   * @return {void}
   */
  static editUserProfile(req, res, next) {
    const {
      email, firstname, lastname, bio, image
    } = req.body;

    const validation = new Validator(
      {
        firstname,
        lastname,
        bio,
        image,
        email
      },
      {
        firstname: 'string|min:2|max:40',
        lastname: 'string|min:2|max:40',
        email: 'string|email',
        image: 'string',
        bio: 'string|min:10|max:300'
      },
      {
        'string.firstname': 'The :attribute has to be a string value.',
        'string.lastname': 'The :attribute has to be a string value.',
        'min.firstname':
          'This :attribute is too short. Minimum length is :min characters.',
        'min.lastname':
          'This :attribute is too short. Minimum length is :min characters.',
        'max.firstname':
          'This :attribute is too long. Max length is :max characters.',
        'max.lastname':
          'This :attribute is too long. Max length is :max characters.',
        'string.email': 'Sorry, the :attribute has to be a string value.',
        'email.email': 'Please enter a valid :attribute address.',
        'string.bio': 'The :attribute has to be a string value',
        'min.bio':
          'This :attribute is too short. Minimum length is :min characters.',
        'max.bio':
          'This :attribute is too long. Max length is :max characters.'
      }
    );
    if (validation.passes()) {
      return next();
    }
    return res.status(400).json({
      errors: validation.errors.all()
    });
  }
}

export default UserValidation;
