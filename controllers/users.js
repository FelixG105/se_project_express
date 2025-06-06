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
    .then((user) => res.status(201).send(user))
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

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
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
  User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });
      res.status(200).send({ user, token });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'AuthenticationFailed') {
        return res.status(401).send({ message: err.message });
      }
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, getUserById, login };
