#!/usr/bin/env node

const got = require('got');
const moment = require('moment');

const _require = require('./services/mongo'),
    addNewBrochureUrl = _require.addNewBrochureUrl;

const _require2 = require('./services/mail'),
    createCampaignAndSend = _require2.createCampaignAndSend;

const logger = require('./services/logger');

// get the nearest sunday and return two-digit month and day combination
const date = moment().day(7).format('MMDD');

if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
  require('dotenv').config();
}

const newBrochureURL = `http://longs.staradvertiser.com/oahu/${date}/pdf/oahu${date}.pdf`;

// :sparkles:
got(newBrochureURL).then(function (res) {
  if (res.statusCode !== 200) {
    throw new Error('Status was not 200, instead: ', res.statusCode);
  }

  logger.info('success fetching new brochure url', { newBrochureURL: newBrochureURL });

  return addNewBrochureUrl(newBrochureURL);
}).then(function (doc) {
  return createCampaignAndSend(doc);
}).catch(function (err) {
  return logger.error(err);
});
