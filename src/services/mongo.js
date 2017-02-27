#!/usr/bin/env node

'use strict';

const mongoose = require('mongoose');
const Promise = require('bluebird');
const moment = require('moment');

const logger = require('./logger');

mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}`);
mongoose.Promise = Promise;

const Schema = mongoose.Schema;

/* eslint camelcase: "off" */
const brochureSchema = new Schema({
  url: {required: true, type: String},
  date_added: {
    required: true,
    type: String,
    default() {
      return moment().format('MMM Do YYYY');
    }
  },
  created_at: {
    type: Date,
    default() {
      return new Date();
    }
  }
});

const Brochure = mongoose.model('Brochure', brochureSchema);

// upserts brochure document and then returns it
function addNewBrochureUrl(url) {
  const newBrochureURLObject = {url};
  const upsertOptions = {upsert: true, new: true};

  const newBrochure = new Brochure({url});

  logger.info('attempting to upsert new brochure url');

  return newBrochure.save()
    .then(() => {
      console.log('newBrochure: ', newBrochure);
      logger.info('brochure document created', {doc: newBrochure._id});
      return newBrochure;
    });
}

module.exports = {addNewBrochureUrl};
