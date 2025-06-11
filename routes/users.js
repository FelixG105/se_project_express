const router = require('express').Router();
const { getCurrentUser, updateProfile } = require('../controllers/users');
const authUser = require('../middlewares/auth');


// Auth Middleware
router.use(authUser);

// Get Current User
router.get('/me', getCurrentUser);

// PATCH update profile
router.patch('/me', updateProfile);

module.exports = router;
