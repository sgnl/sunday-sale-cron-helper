'use strict';

var got = require('got');
var moment = require('moment');

var _require = require('./services/mongo'),
    addNewBrochureUrl = _require.addNewBrochureUrl;

var _require2 = require('./services/mail'),
    createCampaignAndSend = _require2.createCampaignAndSend;

var logger = require('./services/logger');

var date = moment();

var padDate = function padDate(monthStr) {
  return monthStr.length > 1 ? monthStr : '0' + monthStr;
};

function init() {
  if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
    require('dotenv').config();
  }

  var monthStr = padDate(String(date.month() + 1));
  var dayStr = String(date.date());
  var brochureDate = monthStr + dayStr;

  var newBrochureURL = 'http://longs.staradvertiser.com/oahu/' + brochureDate + '/pdf/oahu' + brochureDate + '.pdf';

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
}

exports.init = init;