import Validator from 'validatorjs';

/**
 * @class UserInputValidation
 */
class UserInputValidation {
  /**
   * validate user input on signUp
   *
   * @param {object} req
   * @param {object} res
   * @param {func} next
   *
   * @return {void}
   */
  static signUpInputValidation(req, res, next) {
    const {
      username,
      firstname,
      lastname,
      bio,
      image,
      email,
      password,
      password_confirmation
    } = req.body.user;

    const validation = new Validator(
      {
        username,
        firstname,
        lastname,
        bio,
        image,
        email,
        password,
        password_confirmation
      },
      {
        username: 'required|string|min:2|max:40',
        firstname: ['string', 'min:2', 'max:40'],
        lastname: ['string', 'min:2', 'max:40'],
        email: 'required|string|email',
        image: 'string',
        bio: 'string|min:10|max:300',
        password: 'required|min:8|max:40|confirmed',
        password_confirmation: 'required'
      },
      {
        'required.username': 'Sorry, you have to enter a :attribute.',
        'min.username':
          'The :attribute is too short. Min length is :min characters.',
        'max.username':
          'The :attribute is too long. Max length is :max characters.',
        'string.firstname': 'This :attribute has to be a string value.',
        'string.lastname': 'This :attribute has to be a string value.',
        'min.firstname':
          'This :attribute is too short. Min length is :min characters.',
        'min.lastname':
          'This :attribute is too short. Min length is :min characters.',
        'max.firstname':
          'This :attribute is too long. Max length is :max characters.',
        'max.lastname':
          'This :attribute is too long. Max length is :max characters.',
        'regex.firstname':
          'The :attribute you have entered contains invalid character(s).',
        'regex.lastname':
          'The :attribute you have entered contains invalid character(s).',
        'required.email':
          'Please you have to specify a valid :attribute so we can contact you.',
        'string.email': 'Sorry, the :attribute has to be a string value.',
        'email.email': 'Please enter a valid :attribute address.',
        'required.password': ':attribute field is required.',
        'min.password':
          'The :attribute is too short. Min length is :min characters.',
        'max.password':
          'The :attribute is too long. Max length is :max characters.',
        'confirmed.password': 'Password Mismatch.'
      }
    );
    if (validation.passes()) {
      return next();
    }
    return res.status(400).json({
      errors: validation.errors.all()
    });
  }

  /**
   * validate user input on signUp
   *
   * @param {object} req
   * @param {object} res
   * @param {func} next
   *
   * @return {void}
   */
  static loginInputValidation(req, res, next) {
    const { username, password } = req.body.user;
    const validation = new Validator(
      {
        username,
        password
      },
      {
        username: 'required',
        password: 'required'
      },
      {
        'required.username': 'This :attribute is a required field.',
        'required.password': 'This :attribute is a required field.'
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

export default UserInputValidation;
