const jwt = require('jsonwebtoken');
require('dotenv').config();
const { UNAUTHORIZED } = require('../utils/errors');
const CustomError = require('../utils/customError');
const { JWT_SECRET } = require('../utils/config');

const authUser = (req, res, next) => {
  console.log('authUser Middleware attached');
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    return next(new CustomError('Authorization required', UNAUTHORIZED));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new CustomError('Invalid or expired token', UNAUTHORIZED));
  }

  req.user = payload;

  return next();
};

module.exports = authUser;
