#!/usr/bin/env node


'use strict';

/* eslint new-cap: "off" */

var SendGrid = require('sendgrid');

// const CONFIG = require('../config');
var logger = require('./logger');

var SendGridService = SendGrid(process.env.SENDGRID_API_KEY);

function createCampaignAndSend(_ref) {
  var url = _ref.url;

  return createCampaign(url).then(function (campaignId) {
    return activateCampaign(campaignId);
  });
}

// creates new campaign on sendgrid and returns `campaignId`
function createCampaign(url) {
  logger.info('building new campaign specifications');

  /* eslint camelcase: "off" */
  var request = SendGridService.emptyRequest({
    method: 'POST',
    path: '/v3/campaigns',
    body: {
      title: 'YOUR SUNDAY SALE TITLE',
      subject: 'Your Sunday Sale newletter has arrived!',
      sender_id: 98524,
      list_ids: [787187],
      suppression_group_id: 1925,
      custom_unsubscribe_url: '',
      html_content: '<html><head><title></title></head><body><p>click here to visit the url: <a href="' + url + '">' + url + '<a/></p><p><a href="[unsubscribe]">Unsubscribe from this newsletter</a></p></body></html>',
      plain_content: url + ' [unsubscribe]'
    }
  });

  return SendGridService.API(request).then(function (response) {
    logger.info('success creating new campaign', response);
    return response.body.id;
  });
}

function activateCampaign(id) {
  var request = SendGridService.emptyRequest({
    method: 'POST',
    path: '/v3/campaigns/' + id + '/schedules/now'
  });

  logger.info('attempting to active campaign', { id: id });

  return SendGridService.API(request).then(function (response) {
    logger.info('success activating campaign', response);
    return process.exit(0);
  });
}

module.exports = { createCampaignAndSend: createCampaignAndSend };