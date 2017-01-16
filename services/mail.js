
'use strict';
/* eslint new-cap: "off" */

const SendGrid = require('sendgrid');

const CONFIG = require('../config');
const logger = require('./logger');

const SendGridService  = SendGrid(CONFIG.SENDGRID_API_KEY);

function getEmailsAndSendNewsletter({url}) {
  if (!url) throw Error('cannot send newsletter withour brochure url');

  const request = SendGridService.emptyRequest({
    method: 'GET',
    path: `/v3/contactdb/lists/${CONFIG.LIST_ID}/recipients?page_size=1000&page=1`
  });

  logger.info('fetching contacts');

  return SendGridService.API(request)
    .then(response => {
      logger.info('response from sendgrid', response);
      return response.body.recipients.map(recep => recep.email)
    })
    .then(createCampaign(url))
    .then(campaignId => activateCampaign(campaignId));
}

function createCampaign(url) {
  return (emails) => {
    logger.info('building new campaign specifications');

    const request = SendGridService.emptyRequest({
      method: 'POST',
      path: '/v3/campaigns',
      body: {
        title: 'YOUR SUNDAY SALE TITLE',
        subject: 'Your Sunday Sale newletter has arrived!',
        sender_id: 98524,
        list_ids: [787192 ],
        suppression_group_id: 1925,
        custom_unsubscribe_url: '',
        html_content: `<html><head><title></title></head><body><p>click here to visit the url: <a href="${url}">${url}<a/></p><p><a href="[unsubscribe]">Unsubscribe from this newsletter</a></p></body></html>`,
        plain_content: `${url} [unsubscribe]`
      }
    });

    return SendGridService.API(request)
      .then(response => {
        logger.info('success creating new campaign', response);
        return response.body.id;
      });
  };
}

function activateCampaign(id) {
  const request = SendGridService.emptyRequest({
    method: 'POST',
    path: `/v3/campaigns/${id}/schedules/now`
  });

  logger.info('attempting to active campaign', {id});

  return SendGridService.API(request)
    .then(response => {
      logger.info('success activating campaign', response);
      return process.exit(0);
    });
}

module.exports = { getEmailsAndSendNewsletter };
