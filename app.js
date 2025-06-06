const express = require('express');
const mongoose = require('mongoose');
const mainRouter = require('./routes/index');
const { createUser, login } = require('./controllers/users');
const authUser = require('./middlewares/auth');

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

// Sign in
app.post('/signin', login);

// Sign up
app.post('/signup', createUser);

// Auth Middleware
app.use(authUser);

// Main app router
app.use('/', mainRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
