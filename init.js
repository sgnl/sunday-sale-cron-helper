'use strict';

const got = require('got');
const moment = require('moment');

const {addNewBrochureUrl} = require('./services/mongo');
const {createCampaignAndSend} = require('./services/mail');
const logger = require('./services/logger');

const date = moment();

const padDate = (monthStr) => monthStr.length > 1 ? monthStr : '0' + monthStr;

function init() {
  if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
    require('dotenv').config();
  }

  const monthStr = padDate(String(date.month() + 1));
  const dayStr = String(date.date());

  const newBrochureURL = `http://longs.staradvertiser.com/oahu/${ monthStr + dayStr }/pdf/oahu${ monthStr + dayStr }.pdf`;

  // :sparkles:
  got(newBrochureURL)
    .then(res => {
      if (res.statusCode !== 200) {
        throw new Error('Status was not 200, instead: ', res.statusCode);
      }

      logger.info('success fetching new brochure url', {newBrochureURL});

      return addNewBrochureUrl(newBrochureURL);
    })
    .then(doc => createCampaignAndSend(doc))
    .catch(err => logger.error(err));
}

exports.init = init;
