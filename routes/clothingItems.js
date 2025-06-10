const router = require('express').Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require('../controllers/clothingItems');
const authUser = require('../middlewares/auth');

// Read
router.get('/', getItems);

// Auth middleware
router.use('/', authUser);

// Create
router.post('/', createItem);

// Delete
router.delete('/:itemId', deleteItem);

// Like
router.put('/:itemId/likes', likeItem);

// Unlike
router.delete('/:itemId/likes', unlikeItem);

module.exports = router;
