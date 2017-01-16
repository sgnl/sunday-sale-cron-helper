
'use strict';
const mongoose = require('mongoose');
const Promise = require('bluebird');
const moment = require('moment');

const CONFIG = require('../config');
const logger = require('./logger');

mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}`);
mongoose.Promise = Promise;

const Schema = mongoose.Schema;

const brochureSchema = new Schema({
  url: {required: true, type: String},
  dateAdded: {
    required: true,
    type: String,
    default() { return moment().format('MMM Do YYYY'); }
  },
  created_at: {
    type: Date,
    default() { return new Date(); }
  }
});

const Brochure = mongoose.model('Brochure', brochureSchema);

// upserts brochure document and then returns it
function addNewBrochureUrl(url) {
  const newBrochureURLObject = {url};
  const upsertOptions = {upsert: true, new: true};

  logger.info('attempting to upsert new brochure url');

  return Brochure.findOneAndUpdate(newBrochureURLObject, newBrochureURLObject, upsertOptions)
    .then(doc => {
      logger.info('brochure document created');
      return doc;
    })
}

module.exports = { addNewBrochureUrl };
