const { User, joiValidateLoginUser } = require('../models/User');
const express = require('express');
const route = express.Router();

route.post('/', async (req, res) => {
  //Joi Validation
  const { error } = joiValidateLoginUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Search if the user exist
  const user = await User.findOne({
    $or: [{ username: req.body.username }, { email: req.body.email }],
  });
  if (!user) return res.status(404).send('Username or Password invalid');

  //Check if the password match
  const isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid) return res.status(404).send('Username or Password invalid');

  //generate a token and send it in the header of the request
  const generatedToken = await user.generateAuthToken();
  res
    .status(200)
    .header('x-auth-token', generatedToken)
    .header('access-control-expose-headers', 'x-auth-token');
});

module.exports = route;
