const diva = require('diva-irma-js');
const digidAuth = require('../modules/digid-authentication');

/**
 * Request handler
 * @function requestHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
module.exports = function requestHandler(req, res) {
  const sessionId = req.sessionId;
  return digidAuth
    .getAuthenticatedBSN(req)
    .catch(() => Promise.resolve(null)) // For now we don't fail on authentication errors
    .then((bsn) => {
      const digid = typeof bsn === 'string';
      return diva
        .getAttributes(sessionId)
        .then(attributes => res.json({
          sessionId,
          authenticated: {
            digid,
          },
          attributes,
        }));
    });
};
