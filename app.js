const express = require('express');
const mongoose = require('mongoose');
const mainRouter = require('./routes/index');
const { createUser, login } = require('./controllers/users');

const app = express();
const { PORT = 3001 } = process.env;

// Connect to MongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/wtwr_db')
  .then(() => {
    console.log('Connected to DB');
  })
  .catch(console.error);

// Middleware to parse JSON
app.use(express.json());

// Mock auth middleware
app.use((req, res, next) => {
  req.user = {
    _id: '68309c95b0a47a96eb79f3d1',
  };
  next();
});
// Main app router
app.use('/', mainRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Sign in
app.post('/signin', login);

// Sign up
app.post('/signup', createUser);
