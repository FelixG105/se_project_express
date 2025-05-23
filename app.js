const express = require('express');
const mongoose = require('mongoose');
const mainRouter = require('./routes/index');


const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect('mongodb://127.0.0.1:27017/wtwr_db')
  .then(() => {
    console.log('Connected to DB');
  })
  .catch(console.error);

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '68309c95b0a47a96eb79f3d1',
  };
  next();
});

app.use('/', mainRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

module.exports.createClothingItem = (req, res) => {
  console.log(req.user._id);
  res.status(200).send({ message: 'Clothing item created Successfully' });
};
