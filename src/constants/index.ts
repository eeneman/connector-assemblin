import { contextURLs } from "../config/definitions/pot";

export const DATA_PRODUCT_URL = contextURLs['DataProduct'];
export type DATA_PRODUCT_URL = typeof DATA_PRODUCT_URL;

export const TEMPERATURE = "MeasureAirTemperatureCelsiusDegree";
export const CARBON_DIOXIDE = "MeasureAirCO2LevelPPM";

export type MEASUREMENT_TYPE = typeof TEMPERATURE | typeof CARBON_DIOXIDE;

export const ASSEMBLIN_TEMPERATURE = "TE";
export const ASSEMBLIN_CARBON_DIOXIDE = "CO2";

export type ASSEMBLIN_SENSOR_TYPE = typeof ASSEMBLIN_CARBON_DIOXIDE | typeof ASSEMBLIN_TEMPERATURE;

export const assemblinTypeToPot = {
  TE: TEMPERATURE as MEASUREMENT_TYPE,
  CO2: CARBON_DIOXIDE as MEASUREMENT_TYPE
}

export const potTypeToAssemblin = {
  MeasureAirTemperatureCelsiusDegree: ASSEMBLIN_TEMPERATURE as ASSEMBLIN_SENSOR_TYPE,
  MeasureAirCO2LevelPPM: ASSEMBLIN_CARBON_DIOXIDE as ASSEMBLIN_SENSOR_TYPE
};