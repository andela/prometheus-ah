import Validator from 'validatorjs';

const validateCreateArticle = (req, res, next) => {
  const {
    title,
    body
  } = req.body;

  const data = {
    title,
    body
  };

  const rules = {
    title: 'required|min:3',
    body: 'required|min:8'
  };

  const validation = new Validator(data, rules);

  if (validation.passes()) {
    next();
  } else {
    res.status(400).json({
      errors: validation.errors.all()
    });
  }
};

const validateArticleId = (req, res, next) => {
  const { articleId } = req.params;

  const data = { articleId };

  const rules = {
    articleId: 'required|numeric'
  };

  const validation = new Validator(data, rules);

  if (validation.passes()) {
    next();
  } else {
    res.status(400).json({
      errors: validation.errors.all()
    });
  }
};

export {
  validateCreateArticle,
  validateArticleId
};
