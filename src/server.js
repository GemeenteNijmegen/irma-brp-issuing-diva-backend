const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieEncrypter = require('cookie-encrypter');
const diva = require('diva-irma-js');
const simpleSession = require('./modules/simple-session');
const config = require('./config');

const { jwtDisclosureRequestOptions, jwtSignatureRequestOptions, jwtIssueRequestOptions } = config;

diva.init({
  baseUrl: config.baseUrl,
  apiKey: config.apiKey,
  irmaApiServerUrl: config.irmaApiServerUrl,
  irmaApiServerPublicKey: config.irmaApiServerPublicKey,
  useRedis: config.useRedis,
  redisOptions: {
    host: config.redisHost,
    port: config.redisPort,
    password: config.redisPassword,
  },
  jwtDisclosureRequestOptions: {
    ...jwtDisclosureRequestOptions,
    subject: 'verification_request',
  },
  jwtSignatureRequestOptions: {
    ...jwtSignatureRequestOptions,
    subject: 'signature_request',
  },
  jwtIssueRequestOptions: {
    ...jwtIssueRequestOptions,
    subject: 'issue_request',
  },
});

const app = express();
app.use(cookieParser(config.cookieSecret));
app.use(cookieEncrypter(config.cookieSecret));
app.use(bodyParser.text()); // TODO: restrict to one endpoint
app.use(bodyParser.json()); // TODO: restrict to one endpoint
app.use(simpleSession);

// Reference implementation session management endpoints
app.get('/api/get-session', require('./actions/get-session'));
app.get('/api/deauthenticate', require('./actions/deauthenticate'));

// DIVA disclosure endpoints
app.get('/api/start-disclosure-session', require('./actions/start-simple-disclosure-session'));
app.post('/api/start-irma-session', require('./actions/start-irma-session'));
app.get('/api/disclosure-status', require('./actions/disclosure-status'));

app.use('/api/images/address.jpg', diva.requireAttributes(['pbdf.pbdf.idin.address', 'pbdf.pbdf.idin.city']), require('./actions/get-address-map'));

// DIVA signature endpoints
app.get('/api/signature-status', require('./actions/signature-status'));

// DIVA issue endpoints
app.get('/api/issue-status', require('./actions/issue-status'));

const server = app.listen(config.port, () => {
  console.log(`Diva Reference Third Party backend listening on port ${config.port} !`); // eslint-disable-line no-console
  console.log(`Diva version ${diva.version()}`); // eslint-disable-line no-console
});

module.exports = { app, server };
