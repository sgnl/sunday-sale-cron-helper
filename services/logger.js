'use strict';

var winston = require('winston');

var logger = new winston.Logger({
  transports: [new winston.transports.Console({
    handleExceptions: true,
    json: true
  })],
  exitOnError: false
});

module.exports = logger;