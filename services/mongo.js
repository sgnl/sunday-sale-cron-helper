#!/usr/bin/env node

const mongoose = require('mongoose');
const Promise = require('bluebird');
const moment = require('moment');

const logger = require('./logger');

mongoose.connect('mongodb://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASSWORD + '@' + process.env.MONGO_URL);
mongoose.Promise = Promise;

const Schema = mongoose.Schema;

/* eslint camelcase: "off" */
const brochureSchema = new Schema({
  island: { required: true, type: String },
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

const Brochure = mongoose.model('Brochure', brochureSchema);

// upserts brochure document and then returns it
const addNewBrochureUrl = (brochure) => {
  const upsertOptions = { upsert: true, new: true };

  const newBrochure = new Brochure(brochure);

  logger.info('attempting to upsert new brochure url');

  return newBrochure.save(upsertOptions).then(() => {
    logger.info('brochure document created', { newBrochure });
    return newBrochure;
  });
};

module.exports = { addNewBrochureUrl };