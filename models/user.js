const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: [true, 'The avatar field is required.'],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: 'You must enter a valid URL',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: 'You must enter a valid email address',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 30,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials({
  email,
  password,
}) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        const error = new Error('Incorrect email or password');
        error.name = 'AuthenticationFailed';
        return Promise.reject(error);
      }

      return bcryptjs.compare(password, user.password).then((matched) => {
        if (!matched) {
          const error = new Error('Incorrect email or password');
          error.name = 'AuthenticationFailed';
          return Promise.reject(error);
        }

        return user;
      });
    });
};

userSchema.pre('save', async function encryptPassword(next) {
  if (this.isModified('password')) {
    this.password = await bcryptjs.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('user', userSchema);
