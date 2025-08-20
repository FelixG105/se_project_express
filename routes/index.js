const router = require('express').Router();
const userRouter = require('./users');
const clothingItemsRouter = require('./clothingItems');
const CustomError = require('../utils/customError');
const { NOT_FOUND } = require('../utils/errors');

router.use('/users', userRouter);
router.use('/items', clothingItemsRouter);

router.use((req, res, next) => {
  next(new CustomError('Route not found', NOT_FOUND));
});

module.exports = router;
