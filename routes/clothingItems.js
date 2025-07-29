const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require('../controllers/clothingItems');
const authUser = require('../middlewares/auth');

// Validate

const itemValidator = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required(),
  }),
});

const createItemValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    weather: Joi.string().valid('hot', 'warm', 'cold').required(),
    imageUrl: Joi.string().uri().required(),
  }),
});

const headerValidators = celebrate({
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

// Read
router.get('/', getItemsQueryValidator, getItems);

// Auth middleware
router.use('/', headerValidators, authUser);

// Create
router.post('/', createItemValidator, createItem);

// Delete
router.delete('/:itemId', itemValidator, deleteItem);

// Like
router.put('/:itemId/likes', itemValidator, likeItem);

// Unlike
router.delete('/:itemId/likes', itemValidator, unlikeItem);

module.exports = {router, headerValidators};
