const router = require('express').Router();
const { getCurrentUser, updateProfile } = require('../controllers/users');
const authUser = require('../middlewares/auth');
const {
  headerValidator,
  updateUserValidator,
} = require('../middlewares/validators');

// Auth Middleware
router.use(headerValidator, authUser);

// Get Current User
router.get('/me', getCurrentUser);

// PATCH update profile
router.patch('/me', updateUserValidator, updateProfile);

module.exports = router;
