/**
 * Broker request definitions.
 */

/** List of definitions. */
export const definitions = {   
  /** Header */
  SIGNATURE: 'x-pot-signature',
  APP_TOKEN: 'x-app-token',
  USER_TOKEN: 'x-user-token',

  /** Body */
  PARAMETERS: 'parameters',
  CONTEXT: '@context',
  PRODUCT_CODE: "productCode",
  TIMESTAMP: 'timestamp',

  /** Assemblin specifc body parameters */
  IDS: 'parameters.ids',
  PROPERTY_IDS: 'parameters.ids[0].idProperty',
  ROOM_IDS: 'parameters.ids[0].idRoom',
  DATA_TYPES: 'parameters.dataTypes',
};

/** List of supported headers, and if they're required or not. */
export const supportedHeaders = {
  [definitions.SIGNATURE]: {
      required: false
  },
  [definitions.APP_TOKEN]: {
      required: false
  },
  [definitions.USER_TOKEN]: {
      required: false
  }
};

/** List of supported parameters, and if they're required or not. */
export const supportedParameters = {
  [definitions.PRODUCT_CODE]: {
    required: false
  },
  [definitions.CONTEXT]: {
    required: false
  },
  [definitions.TIMESTAMP]: {
    required: false
  },
  [definitions.PARAMETERS]: {
    required: true
  },
  [definitions.IDS]: {
    required: true
  },
  [definitions.ROOM_IDS]: {
    required: true
  },
  [definitions.PROPERTY_IDS]: {
    required: true
  },
  [definitions.DATA_TYPES]: {
    required: true
  }
};
