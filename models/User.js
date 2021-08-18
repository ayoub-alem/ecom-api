const mongoose = require('mongoose');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    maxlength: 50,
    minlength: 5,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    unique: true,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      isAdmin: this.isAdmin,
    },
    process.env.JWTSTRING
  );

  return token;
};

const User = mongoose.model('User', userSchema);

function joiValidateLoginUser(req) {
  const schema = Joi.object({
    username: Joi.string().min(5).max(50).required(),
    password: Joi.string().min(8).max(1024).required(),
  });

  return schema.validate(req);
}

function joiValidateSignupUser(req) {
  const schema = Joi.object({
    username: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(8).max(1024).required(),
  });

  return schema.validate(req);
}

module.exports = {
  User,
  joiValidateLoginUser,
  joiValidateSignupUser,
};
