const { User, joiValidateSignupUser } = require('../models/User');
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const route = express.Router();

route.post('/', async (req, res) => {
  //Joi Validation
  const { error } = joiValidateSignupUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Check if the User exist
  let user = await User.findOne({
    $or: [{ username: req.body.username }, { email: req.body.email }],
  });
  if (user) return res.status(400).send('Username or email already exist');

  //hashing password
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(req.body.password, salt);

  //create new user
  user = _.pick(req.body, ['username', 'email']);
  user.password = hashed;
  user = await User.create(userObj);

  //generate a token and send it in the header of the request
  const generatedToken = user.generateAuthToken();
  res
    .status(201)
    .header('x-auth-token', generatedToken)
    .header('access-control-expose-headers', 'x-auth-token')
    .send(_.pick(user, ['_id', 'username', 'email', 'isAdmin']));
});

module.exports = route;
