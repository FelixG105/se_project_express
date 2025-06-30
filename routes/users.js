const router = require('express').Router();
const { getCurrentUser, updateProfile } = require('../controllers/users');
const authUser = require('../middlewares/auth');

// Auth Middleware
router.use(authUser);

// Get Current User
router.get('/users/me', getCurrentUser);

// PATCH update profile
router.patch('/users/me', updateProfile);

module.exports = router;
