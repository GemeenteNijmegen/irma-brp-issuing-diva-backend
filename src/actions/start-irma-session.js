const diva = require('diva-irma-js');
const moment = require('moment');

const config = require('./../config');
const digidAuth = require('../modules/digid-authentication');
const brpService = require('../modules/brp-service');

const schemeManagerId = config.schemeManagerId;

function startBRPIssueSession(req, credentialType) {
  if (credentialType === 'BRP1') {
    return digidAuth
      .getAuthenticatedBSN(req)
      .then(brpService.getDataForBSN)
      .then(brpData => [{
        credential: `${schemeManagerId}.nijmegen.address`,
        validity: moment().add(1, 'year').unix(),
        attributes: {
          street: brpData.adres.straat,
          houseNumber: brpData.adres.huisnummer,
          zipcode: brpData.adres.Postcode,
          municipality: brpData.adres.Gemeente,
          city: brpData.adres.woonplaats,
          // country: 'Nederland',
        },
      }, {
        credential: `${schemeManagerId}.nijmegen.ageLimits`,
        validity: moment().add(5, 'year').unix(),
        attributes: {
          over12: brpData.agelimits.over12,
          over16: brpData.agelimits.over16,
          over18: brpData.agelimits.over18,
          over21: brpData.agelimits.over21,
          over65: brpData.agelimits.over65,
        },
      }, {
        credential: `${schemeManagerId}.nijmegen.bsn`,
        validity: moment().add(5, 'year').unix(),
        attributes: {
          bsn: brpData.BSN.bsn,
        },
      }, {
        credential: `${schemeManagerId}.nijmegen.personalData`,
        validity: moment().add(5, 'year').unix(),
        attributes: {
          initials: brpData.persoonsgegevens.initialen,
          firstnames: brpData.persoonsgegevens.voornamen,
          prefix: brpData.persoonsgegevens.voorvoegsel,
          familyname: brpData.persoonsgegevens.achternaam,
          fullname: brpData.persoonsgegevens.volledigenaam ?
            brpData.persoonsgegevens.volledigenaam :
            `${brpData.persoonsgegevens.voornamen} ${brpData.persoonsgegevens.achternaam}`,
          dateofbirth: brpData.persoonsgegevens.Geboortedatum,
          gender: brpData.persoonsgegevens.geslacht,
          nationality: brpData.persoonsgegevens.Nationaliteit,
        },
      }])
      .then(diva.startIssueSession);
  }
  return Promise.reject('Unkown credentialType.');
}

/**
 * Request handler for starting a new disclosure session via POST request
 * @function requestHandler
 * @param {object} req Express request object, containing an IRMA content object
 * @param {object} res Express response object
 * @returns {undefined}
 */
module.exports = function requestHandler(req, res) {
  const {
    type,
    content,
    message,
    credentialType,
  } = req.body;
  Promise
    .resolve()
    .then(() => {
      switch (type) {
        case 'DISCLOSE':
          if (!content) {
            return res.end('content not set.');
          }
          console.log(`Requesting disclosure of ${content}`);
          return diva.startDisclosureSession(req.sessionId, content);

        case 'SIGN':
          if (!content) {
            return res.end('content not set.');
          }
          console.log(`Requesting signing of ${message} with ${content}`);
          return diva.startSignatureSession(content, null, message);

        case 'ISSUE':
          if (!credentialType) {
            return res.end('credentialType not set.');
          }
          console.log(`Starting issuing of ${credentialType}`);
          return startBRPIssueSession(req, credentialType);

        default:
          throw new Error('IRMA session type not specified');
      }
    })
    .then((irmaSessionData) => {
      res.setHeader('Content-type', 'application/json; charset=utf-8');
      res.json(irmaSessionData);
    })
    .catch((error) => {
      res.end(error.toString());
    });
};

