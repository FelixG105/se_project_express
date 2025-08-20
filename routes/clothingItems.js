const router = require('express').Router();
const {
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require('../controllers/clothingItems');
const {
  createItemValidator,
  itemValidator,
} = require('../middlewares/validators');



// Create
router.post('/', createItemValidator, createItem);

// Delete
router.delete('/:itemId', itemValidator, deleteItem);

// Like
router.put('/:itemId/likes', itemValidator, likeItem);

// Unlike
router.delete('/:itemId/likes', itemValidator, unlikeItem);

module.exports = router;
