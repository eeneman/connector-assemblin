import { contextURLs } from "../config/definitions/pot";

export const DATA_PRODUCT_URL = contextURLs['DataProduct'];
export type DATA_PRODUCT_URL = typeof DATA_PRODUCT_URL;

export const TEMPERATURE = "MeasureAirTemperatureCelsiusDegree";
export const CARBON_DIOXIDE = "MeasureAirCO2LevelPPM";
export const HUMIDITY = "MeasureAirHumidityPercent";
export const PRESENCE = "MeasurePresence";
export const ELECTRICITY_KWH="MeasureElectricityConsumptionKilowattHour";
export const ELECTRICITY_MWH="MeasureHeatingElectricityConsumptionKilowattHour";


export type MEASUREMENT_TYPE = typeof TEMPERATURE | typeof CARBON_DIOXIDE | typeof HUMIDITY | typeof PRESENCE | typeof ELECTRICITY_KWH | typeof ELECTRICITY_MWH;

export const ASSEMBLIN_TEMPERATURE = "TE";
export const ASSEMBLIN_CARBON_DIOXIDE = "CO2";
export const ASSEMBLIN_HUMIDITY = "HUM";
export const ASSEMBLIN_PRESENCE = "OCC";
export const ASSEMBLIN_ELECTRICITY_KWH = "kWh";
export const ASSEMBLIN_ELECTRICITY_MWH = "MWh";

export type ASSEMBLIN_SENSOR_TYPE = typeof ASSEMBLIN_CARBON_DIOXIDE | typeof ASSEMBLIN_TEMPERATURE | typeof ASSEMBLIN_HUMIDITY | typeof ASSEMBLIN_PRESENCE | typeof ASSEMBLIN_ELECTRICITY_KWH | typeof ASSEMBLIN_ELECTRICITY_MWH;

export const assemblinTypeToPot = {
  TE: TEMPERATURE as MEASUREMENT_TYPE,
  CO2: CARBON_DIOXIDE as MEASUREMENT_TYPE,
  HUM: HUMIDITY as MEASUREMENT_TYPE,
  OCC: PRESENCE as MEASUREMENT_TYPE,
  kWh: ELECTRICITY_KWH as MEASUREMENT_TYPE,
  MWh: ELECTRICITY_MWH as MEASUREMENT_TYPE,
}

export const potTypeToAssemblin = {
  MeasureAirTemperatureCelsiusDegree: ASSEMBLIN_TEMPERATURE as ASSEMBLIN_SENSOR_TYPE,
  MeasureAirCO2LevelPPM: ASSEMBLIN_CARBON_DIOXIDE as ASSEMBLIN_SENSOR_TYPE,
  MeasureAirHumidityPercent: ASSEMBLIN_HUMIDITY as ASSEMBLIN_SENSOR_TYPE,
  MeasurePresence: ASSEMBLIN_PRESENCE as ASSEMBLIN_SENSOR_TYPE,
  MeasureElectricityConsumptionKilowattHour: ASSEMBLIN_ELECTRICITY_KWH as ASSEMBLIN_SENSOR_TYPE,
  MeasureHeatingElectricityConsumptionKilowattHour: ASSEMBLIN_ELECTRICITY_MWH as ASSEMBLIN_SENSOR_TYPE
};