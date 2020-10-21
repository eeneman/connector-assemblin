/**
 * Module dependencies.
 */
import { promiseRejectWithError } from '../protocols/rest';
import { validate } from './validator';
import fs from 'fs';
import axios from 'axios';
import https from 'https';

// Set directories.
const configsDir = './config';

// Make sure directories for templates, protocols, configs and plugins exists.
if (!fs.existsSync(configsDir)) fs.mkdirSync(configsDir);

/**
 * Connector library.
 *
 * Handles data fetching and translation.
 */

/** Import platform of trust definitions. */
import { supportedParameters } from '../../config/definitions/request';
import { Sensor, ConnectorRequestBody, AssemblinSensorValueResponse as AssemblinSensor } from '../../types';
import { assemblinTypeToPot } from '../../constants';

/**
 * Requests data from Assemblin based on parameters provided in the body and returns that data in the format used by Platform of Trust
 *
 * @param requestBody request body
 * 
 * @return Translated data
 */
export const translateRequestData = async (requestBody: ConnectorRequestBody): Promise<Sensor[]> => {

  /** Parameter validation */
  const validation = validate(requestBody, supportedParameters);
  if (Object.hasOwnProperty.call(validation, 'error')) {
    if (validation.error) return promiseRejectWithError(422, validation.error);
  }

  /** Fetching a token cookie from Assemblin */
  const assemblinCredentials = { username: process.env.ASSEMBLIN_USER_NAME, password: process.env.ASSEMBLIN_USER_PASSWORD };
  const assemblinCookieResponse = await axios(`${ process.env.ASSEMBLIN_SERVER_URL }/assemblin/users/login`, {
    method: "POST",
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    data: assemblinCredentials
  });
  const assemblinCookieToken = assemblinCookieResponse.headers["set-cookie"][0].split(";")[0];

  /** Fetching sensor data from Assemblin  */
  const assemblinDataResponse = await axios(`${ process.env.ASSEMBLIN_SERVER_URL }/assemblin/points/bymeta`, {
    method: "GET",
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    headers: {
      "Cookie": assemblinCookieToken
    }
  });

  /** Filtering and translating the received data */
  const sensors: Sensor[] = [];

  assemblinDataResponse.data.forEach((assemblinSensor: AssemblinSensor) => {
    const existingEntry = findExistingSensorEntry(sensors, assemblinSensor);
    const isRequested = checkIsSensorRequested(requestBody, assemblinSensor);
    
    if (!existingEntry && isRequested) {
      sensors.push(translateData(assemblinSensor));
    } else if (existingEntry && isRequested){
      addValueToExistingSensorEntry(sensors, existingEntry, assemblinSensor);
    }
  });

  return sensors;
};

/**
 * Adds a value to an existing sensor entry
 * 
 * @param sensors an array of sensor to update
 * @param existingEntry an existing sensor entry
 * @param assemblinSensor the value will be extracted from this Assemblin sensor
 */
const addValueToExistingSensorEntry = (sensors: Sensor[], existingEntry: Sensor, assemblinSensor: AssemblinSensor) => {
  const existingEntryIndex = sensors.findIndex(sensorEntry => sensorEntry === existingEntry);
  existingEntry.measurements.push({ value: assemblinSensor.value, "@type": assemblinTypeToPot[assemblinSensor.type] });
  sensors[existingEntryIndex] = existingEntry;
}

/**
 * Checks if a sensor matches parameters in a request body
 * 
 * @param requestBody a body to match with a sensor
 * @param newAssemblinSensor a sensor to match with a body
 * 
 * @returns is sensor requested
 */
const checkIsSensorRequested = (requestBody: ConnectorRequestBody, newAssemblinSensor: AssemblinSensor): boolean => {
  return requestBody.parameters.ids.find(id => id.idProperty === newAssemblinSensor.property && id.idRoom === newAssemblinSensor.room) !== undefined && 
  requestBody.parameters.dataTypes.find(dataType => dataType === assemblinTypeToPot[newAssemblinSensor.type]) !== undefined;
}

/**
 * Checks if an entry with identical values for idProperty and idRoom
 * 
 * @param sensors an array to search from
 * @param newAssemblinSensor values for search will be extracted from this sensor
 * 
 * @returns found existing sensor entry or undefined if not found
 */
const findExistingSensorEntry = (sensors: Sensor[], newAssemblinSensor: AssemblinSensor): Sensor | undefined => {
  return sensors.find(sensorEntry => sensorEntry.id.idProperty === newAssemblinSensor.property && sensorEntry.id.idRoom === newAssemblinSensor.room);
}

/**
 * Translates a sensor from Assemblin to format used by Platform of Trust
 * 
 * @param assemblinSensor
 * 
 * @returns translated sensor 
 */
const translateData = (assemblinSensor: AssemblinSensor): Sensor => {
  return {
    measurements: [{ value: assemblinSensor.value, "@type": assemblinTypeToPot[assemblinSensor.type] }],
    id: { idRoom: assemblinSensor.room, idProperty: assemblinSensor.property }
  }
}
