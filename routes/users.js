const router = require('express').Router();
const { getUsers, createUser, getUserById } = require('../controllers/users');


router.get('/', getUsers);

router.get('/:userId', getUserById);

// Create
router.post('/', createUser);

module.exports = router;
