const { celebrate, Joi } = require('celebrate');

const validator = require('validator');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

const itemValidator = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required(),
  }),
});

const createItemValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      'string.empty': 'The "name" field must be filled in',
      'string.min': 'The minimum length of the "name" field is 2',
      'string.max': 'The maximum length of the "name" field is 30',
    }),
    weather: Joi.string().valid('hot', 'warm', 'cold').required().messages({
      'any.only': 'Weather must be one of "hot", "warm", or "cold"',
      'string.empty': 'The "weather" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      'string.empty': 'The "imageUrl" field must be filled in',
      'string.uri': 'The "imageUrl" field must be a valid URL',
    }),
  }),
});

const updateUserValidator = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().min(2).max(30),
      imageUrl: Joi.string().required().custom(validateURL).messages({
        'string.empty': 'The "imageUrl" field must be filled in',
        'string.uri': 'The "imageUrl" field must be a valid URL',
      }),
    })
    .min(1),
});

const headerValidator = celebrate({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
});

const getItemsQueryValidator = celebrate({
  query: Joi.object().keys({
    weather: Joi.string().valid('hot', 'warm', 'cold'),
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
  }),
});

module.exports = {
  itemValidator,
  createItemValidator,
  updateUserValidator,
  headerValidator,
  getItemsQueryValidator,
  validateURL,
};
