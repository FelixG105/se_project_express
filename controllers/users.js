const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../utils/errors');

// GET /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR)
        .send({ message: 'An error has occurred on the server' });
    });
};

// POST /users

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  User.create({ name, avatar, email, password })

    .then((user) => {
      const userNoPassword = user.toObject();
      delete userNoPassword.password;
      res.status(201).send(userNoPassword);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid data' });
      }
      if (err.code === 11000) {
        return res.status(409).send({ message: 'User email already in use' });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: 'An error has occurred on the server' });
    });
};

const getCurrentUser = (req, res) => {
  const { _id } = req.user;
  User.findById(_id)
    .select('-password')
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .send({ message: 'User email or password not provided' });
  }
  return User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });
      res.status(200).send({ user, token });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'AuthenticationFailed') {
        return res.status(400).send({ message: err.message });
      }
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

// PATCH - update profile

const updateProfile = (req, res) => {
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
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, getCurrentUser, login, updateProfile };
