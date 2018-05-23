const config = require('./../config');

const subscriberHeader = 'X-Nijm-Subscriber-Id';
const securityLevelHeader = 'Zekerheidsniveau';
const requiredSecurityLevel = 10;

function getAuthenticatedBSN(req) {
  if (config.disableDigidAuthentication) {
    return Promise.resolve(config.demoBSN);
  }
  if (req.header(subscriberHeader)
    && req.header(securityLevelHeader) === requiredSecurityLevel) {
    return Promise.resolve(req.header(subscriberHeader));
  }
  return Promise.reject('Unable to retrieve Digid authentication');
}

module.exports.getAuthenticatedBSN = getAuthenticatedBSN;
