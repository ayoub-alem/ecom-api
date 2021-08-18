require('dotenv').config();
const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/joiObjectId')();
require('./startup/db')();
require('./startup/routes')(app);

const port = 5000 || process.env.PORT;
app.listen(port, () => winston.info(`App is listening on port ${port} ...`));
