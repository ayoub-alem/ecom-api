const express = require('express');
const path = require('path');

//requiring middlewares
const cors = require('cors');
const bodyParser = require('body-parser');
const error = require('../middlewares/error');
const signup = require('../routes/signUp');
const login = require('../routes/login');
const orders = require('../routes/orders');
const categorie = require('../routes/categorie');
const product = require('../routes/product');

module.exports = function (app) {
  app.use(cors());
  app.use('/public', express.static(path.join(__dirname, '../public')));
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/api/product', product);
  app.use('/api/mycart', orders);
  app.use('/api/categorie', categorie);
  app.use('/api/signup', signup);
  app.use('/api/login', login);
  app.use(error);
};
