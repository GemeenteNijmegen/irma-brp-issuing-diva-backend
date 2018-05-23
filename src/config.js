const config = {
  port: process.env.PORT ? process.env.PORT : 4000,
  cookieSecret: process.env.COOKIE_SECRET ? process.env.COOKIE_SECRET : 'StRoNGs3crE7',
  cookieName: process.env.COOKIE_NAME ? process.env.COOKIE_NAME : 'diva-session',
  cookieSettings: {
    httpOnly: true,
    maxAge: 300000,
    sameSite: true,
    signed: true,
    secure: false, // TODO: NOTE: must be set to true and be used with HTTPS only!
  },
  baseUrl: process.env.BASE_URL ? process.env.BASE_URL : 'http://localhost:4000',
  apiKey: process.env.IRMA_API_SERVER_KEY ? process.env.IRMA_API_SERVER_KEY : null,
  irmaApiServerUrl: process.env.IRMA_API_SERVER_URL ? process.env.IRMA_API_SERVER_URL : 'http://localhost:8088/irma_api_server',
  irmaApiServerPublicKey: process.env.IRMA_API_SERVER_PUBLIC_KEY ? process.env.IRMA_API_SERVER_PUBLIC_KEY : 'FILL_IN',
  useRedis: process.env.USE_REDIS && process.env.USE_REDIS === 'true',
  redisHost: process.env.REDIS_HOST ? process.env.REDIS_HOST : 'localhost',
  redisPort: process.env.REDIS_PORT ? process.env.REDIS_PORT : '6379',
  redisPassword: process.env.REDIS_PASSWORD ? process.env.REDIS_PASSWORD : '',
  bingMapsApiKey: process.env.BING_MAPS_API_KEY ? process.env.BING_MAPS_API_KEY : '',
  jwtDisclosureRequestOptions: {
    algorithm: process.env.JWT_DISCLOSURE_ALGORITHM ? process.env.JWT_DISCLOSURE_ALGORITHM : 'none',
    issuer: process.env.JWT_DISCLOSURE_ISSUER ? process.env.JWT_DISCLOSURE_ISSUER : 'diva',
  },
  jwtSignatureRequestOptions: {
    algorithm: process.env.JWT_SIGNATURE_ALGORITHM ? process.env.JWT_SIGNATURE_ALGORITHM : 'none',
    issuer: process.env.JWT_SIGNATURE_ISSUER ? process.env.JWT_SIGNATURE_ISSUER : 'diva',
  },
  jwtIssueRequestOptions: {
    algorithm: process.env.JWT_ISSUE_ALGORITHM ? process.env.JWT_ISSUE_ALGORITHM : 'none',
    issuer: process.env.JWT_ISSUE_ISSUER ? process.env.JWT_ISSUE_ISSUER : 'diva',
  },
  brpApiUrl: process.env.BRP_API_URL ? process.env.BRP_API_URL : 'https://data-test.nijmegen.nl/brp/personen/attributen',
  schemeManagerId: process.env.SCHEME_MANAGER_ID ? process.env.SCHEME_MANAGER_ID : 'irma-demo',
  demoBSN: process.env.DEMO_BSN ? process.env.DEMO_BSN : '304661818',
  disableDigidAuthentication: process.env.DISABLE_DIGID_AUTHENTICATION && process.env.DISABLE_DIGID_AUTHENTICATION === 'true',
};

module.exports = config;
