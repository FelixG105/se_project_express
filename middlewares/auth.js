const jwt = require('jsonwebtoken');
require('dotenv').config();
const { UNAUTHORIZED } = require('../utils/errors');

const authUser = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    return res.status(UNAUTHORIZED).send({ message: 'Authorization required' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res
      .status(UNAUTHORIZED)
      .json({ message: 'Invalid or expired token' });
  }

  req.user = payload;

  return next();
};

module.exports = authUser;
