const router = require('express').Router();
const { getCurrentUser, updateProfile } = require('../controllers/users');

// Get Current User
router.get('/users/me', getCurrentUser);

// PATCH update profile
router.patch('/users/me', updateProfile);

module.exports = router;
