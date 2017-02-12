#!/usr/bin/env node

'use strict';

const got = require('got');

const {addNewBrochureUrl} = require('./services/mongo');
const {createCampaignAndSend} = require('./services/mail');
const logger = require('./services/logger');

require('dotenv').config();

const newBrochureURL = `http://longs.staradvertiser.com/oahu/${process.argv[2]}/pdf/oahu${process.argv[2]}.pdf`;

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
