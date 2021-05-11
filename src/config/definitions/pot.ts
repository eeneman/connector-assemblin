/**
 * Platform of Trust definitions.
 */

/** Default RSA key size for generated keys. */
export const defaultKeySize = 4096;

/** URLs of Platform of Trust public keys. */
export const publicKeyURLs = [
  /** Primary keys. */
  {
      env: 'production',
      url: 'https://static.oftrust.net/keys/translator.pub'
  },
  {
      env: 'sandbox',
      url: 'https://static-sandbox.oftrust.net/keys/translator.pub'
  },
  {
      env: 'staging',
      url: 'https://static-staging.oftrust.net/keys/translator.pub'
  },
  {
      env: 'static-test',
      url: 'https://static-test.oftrust.net/keys/translator.pub'
  }
];

/** Context URLs. */
export const contextURLs = {
  DataProduct: 'https://standards.oftrust.net/v2/Context/DataProductContext/Sensor/'
};

