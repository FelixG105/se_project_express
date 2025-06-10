const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
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

// cors
app.use(cors());

// Sign in
app.post('/signin', login);
// Sign up
app.post('/signup', createUser);

// Main app router
app.use('/', mainRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
