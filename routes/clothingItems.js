const router = require('express').Router();
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require('../controllers/clothingItems');
const authUser = require('../middlewares/auth');
const {
  createItemValidator,
  itemValidator,
  headerValidator,
  getItemsQueryValidator,
} = require('../middlewares/validators');

// Read
router.get('/', getItemsQueryValidator, getItems);

// Auth middleware
router.use('/', headerValidator, authUser);

// Create
router.post('/', createItemValidator, createItem);

// Delete
router.delete('/:itemId', itemValidator, deleteItem);

// Like
router.put('/:itemId/likes', itemValidator, likeItem);

// Unlike
router.delete('/:itemId/likes', itemValidator, unlikeItem);

module.exports = router;
