#!/usr/bin/env node


'use strict';

var mongoose = require('mongoose');
var Promise = require('bluebird');
var moment = require('moment');

var logger = require('./logger');

mongoose.connect('mongodb://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASSWORD + '@' + process.env.MONGO_URL);
mongoose.Promise = Promise;

var Schema = mongoose.Schema;

/* eslint camelcase: "off" */
var brochureSchema = new Schema({
  url: { required: true, type: String },
  date_added: {
    required: true,
    type: String,
    default: function _default() {
      return moment().day(7).format('MMM Do YYYY');
    }
  },
  created_at: {
    type: Date,
    default: function _default() {
      return new Date();
    }
  }
});

var Brochure = mongoose.model('Brochure', brochureSchema);

// upserts brochure document and then returns it
function addNewBrochureUrl(url) {
  var upsertOptions = { upsert: true, new: true };

  var newBrochure = new Brochure({ url: url });

  logger.info('attempting to upsert new brochure url');

  return newBrochure.save(upsertOptions).then(function () {
    logger.info('brochure document created', { doc: newBrochure._id });
    return newBrochure;
  });
}

module.exports = { addNewBrochureUrl: addNewBrochureUrl };