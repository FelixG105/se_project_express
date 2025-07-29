const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');
const {
  BAD_REQUEST,
  NOT_FOUND,
  DUPLICATE_ERROR,
  UNAUTHORIZED,
} = require('../utils/errors');
const { JWT_SECRET } = require('../utils/config');
const CustomError = require('../utils/customError');

// POST /users

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  User.create({
    name,
    avatar,
    email,
    password,
  })
    .then((user) => {
      const userNoPassword = user.toObject();
      delete userNoPassword.password;
      res.status(201).send(userNoPassword);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new CustomError('Invalid data', BAD_REQUEST));
      }
      if (err.code === 11000) {
        return next(new CustomError('Email already in use', DUPLICATE_ERROR));
      }
      return next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .select('-password')
    .orFail()
    .then((user) => {
      res.send(user);
    })

    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new CustomError(err.message, NOT_FOUND));
      }
      if (err.name === 'CastError') {
        return next(new CustomError(err.message, BAD_REQUEST));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: 'User email or password not provided' });
  }
  return User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.name === 'AuthenticationFailed') {
        return next(new CustomError(err.message, UNAUTHORIZED));
      }
      return next(err);
    });
};

// PATCH - update profile

const updateProfile = (req, res, next) => {
  const { _id } = req.user;
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    _id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'User not found' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return next(new CustomError('Invalid data', BAD_REQUEST));
      }
      if (err.name === 'CastError') {
        return next(new CustomError(err.message, BAD_REQUEST));
      }
      return next(err);
    });
};

module.exports = { createUser, getCurrentUser, login, updateProfile };
