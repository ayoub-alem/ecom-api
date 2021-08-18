const winston = require('winston');
const { format } = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function () {
  winston.exceptions.handle(
    new winston.transports.Console({
      format: format.combine(
        format.timestamp(),
        format.colorize(),
        format.simple()
      ),
    }),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
  );

  process.on('unhandledRejection', (ex) => {
    throw ex;
  });
  winston.add(
    new winston.transports.Console({
      format: format.combine(
        format.timestamp(),
        format.colorize(),
        format.simple()
      ),
    })
  );
  winston.add(new winston.transports.File({ filename: 'logfile.log' }));
  winston.add(
    new winston.transports.MongoDB({
      db: 'mongodb://localhost:27017/ecommerce-website',
      level: 'info',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  );
};
