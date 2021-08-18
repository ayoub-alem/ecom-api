const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function () {
  mongoose
    .connect('mongodb://localhost:27017/ecommerce-website', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => winston.info('Connected to MongoDB...'));
};
