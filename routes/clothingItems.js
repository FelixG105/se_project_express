const router = require('express').Router();

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require('../controllers/clothingItems');

// Create
router.post('/', createItem);

// Read
router.get('/', getItems);

// Update
router.patch('/:itemId', updateItem);

// Delete
router.delete('/:itemId', deleteItem);

// Like
router.put('/:itemId/likes', likeItem);

// Unlike
router.delete('/:itemId/likes', unlikeItem);

module.exports = router;
