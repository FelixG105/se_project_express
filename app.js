const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const mainRouter = require('./routes/index');
const {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
} = require('./controllers/users');
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

// **** Auth Middleware *****
app.use(authUser);

// cors
app.use(cors());

// Main app router
app.use('/', mainRouter);

// Get Current User
app.get('/users/me', getCurrentUser);

// PATCH update profile
app.post('/users/me', updateProfile);

// Start server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
