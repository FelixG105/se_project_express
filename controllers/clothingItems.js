const ClothingItem = require('../models/clothingItem');
const { BAD_REQUEST, NOT_FOUND, FORBIDDEN } = require('../utils/errors');
const CustomError = require('../utils/customError');

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new CustomError('Invalid data', BAD_REQUEST));
      }
      return next(err); // will default to 500 if no statusCode
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => {
      res.send(items);
    })
    .catch(next);
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id.toString()) {
        return res.status(FORBIDDEN).send({ message: 'Action is Forbidden' });
      }
      return item.deleteOne().then(() => {
        res.status(200).send({ message: 'Successfully deleted' });
      });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new CustomError(err.message, BAD_REQUEST));
      }
      if (err.name === 'DocumentNotFoundError') {
        return next(new CustomError(err.message, NOT_FOUND));
      }
      return next(err);
    });
};

const likeItem = (req, res, next) => {
  const owner = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    {
      $addToSet: { likes: owner },
    },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new CustomError(err.message, BAD_REQUEST));
      }
      if (err.name === 'DocumentNotFoundError') {
        return next(new CustomError(err.message, NOT_FOUND));
      }
      return next(err);
    });
};

const unlikeItem = (req, res, next) => {
  const owner = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    {
      $pull: { likes: owner },
    },
    {
      new: true,
    }
  )
    .orFail()
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new CustomError(err.message, BAD_REQUEST));
      }
      if (err.name === 'DocumentNotFoundError') {
        return next(new CustomError(err.message, NOT_FOUND));
      }
      return next(err);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
