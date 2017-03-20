#!/usr/bin/env node

/* eslint new-cap: "off" */

const SendGrid = require('sendgrid');

const logger = require('./logger');

const SendGridService = SendGrid(process.env.SENDGRID_API_KEY);

// creates new campaign on sendgrid and returns `campaignId`
const createCampaign = allBrochures => {
  logger.info('building new campaign specifications');

  const brochureListHTMLString = allBrochures.map(brochure => {
    return `<li><a href="${brochure.url}">${brochure.island} - ${brochure.url}</a></li>`;
  }).join('');

  const plainContent = allBrochures.map(brochure => {
    return `${brochure.island} - ${brochure.url}`;
  }).join(', ');

  /* eslint camelcase: "off" */
  const request = SendGridService.emptyRequest({
    method: 'POST',
    path: '/v3/campaigns',
    body: {
      title: 'YOUR SUNDAY SALE TITLE',
      subject: 'Your Sunday Sale newletter has arrived!',
      sender_id: 98524,
      // list_ids: [787192], // debug
      list_ids: [787187],
      suppression_group_id: 1925,
      custom_unsubscribe_url: '',
      html_content: `<html><head><title></title></head><body><p>Here are this week's brochures.</p><ul>${brochureListHTMLString}</ul><p><a href="[unsubscribe]">Unsubscribe from this newsletter</a></p></body></html>`,
      plain_content: plainContent + ' [unsubscribe]'
    }
  });

  return SendGridService.API(request).then(response => {
    logger.info('success creating new campaign', response);
    return response.body.id;
  });
};

const activateCampaign = id => {
  const request = SendGridService.emptyRequest({
    method: 'POST',
    path: `/v3/campaigns/${id}/schedules/now`
  });

  logger.info('attempting to active campaign', { id });

  return SendGridService.API(request).then(response => {
    logger.info('success activating campaign', response);
    return process.exit(0);
  });
};

const createCampaignAndSend = allBrochures => createCampaign(allBrochures).then(activateCampaign);

module.exports = { createCampaignAndSend };
