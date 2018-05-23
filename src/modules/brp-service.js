const request = require('superagent');
const config = require('./../config');

const brpApiUrl = config.brpApiUrl;

function getDataForBSN(bsn) {
  return request
    .post(brpApiUrl)
    .type('application/json')
    .send({
      BSN: bsn,
    })
    .then(response => response.body.persoon)
    .catch((error) => {
      const e = new Error(`Unable to fetch BRP data: ${error.message}`);
      throw e;
    });
}

module.exports.getDataForBSN = getDataForBSN;
