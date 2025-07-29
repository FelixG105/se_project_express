const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getCurrentUser, updateProfile } = require('../controllers/users');
const authUser = require('../middlewares/auth');
const { headerValidator } = require('./clothingItems');

// Auth Middleware
router.use(headerValidator, authUser);

// Get Current User
router.get('/me', getCurrentUser);

// PATCH update profile
router.patch(
  '/me',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().min(2).max(30),
        avatar: Joi.string().uri(),
      })
      .min(1),
  }),
  updateProfile
);

module.exports = router;
