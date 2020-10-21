import { MEASUREMENT_TYPE } from "../constants";
import { DATA_PRODUCT_URL } from "../constants";
import { ASSEMBLIN_SENSOR_TYPE } from "../constants";

export interface HttpError {
  message: string;
  status: number;
}

export interface GreenlockConfig {
  sites: GreenlockSiteConfig[];
}

interface GreenlockSiteConfig {
  subject?: string;
  altnames: (string | undefined)[];
}



interface Measurement {
  "@type": MEASUREMENT_TYPE;
  value: number;
}

interface AssemblinIds {
  idProperty: string;
  idRoom: string;
}

export interface ConnectorRequestBody {
  parameters: {
    ids: AssemblinIds[]; 
    dataTypes: [
      MEASUREMENT_TYPE
    ];
  };
  "@context": DATA_PRODUCT_URL;
  timestamp: string;
  productCode: string;
}

export interface Sensor {
  id: AssemblinIds;
  measurements: Measurement[]
}

export interface AssemblinSensorValueResponse {
  value: number;
  property: string;
  room: string;
  sensor: string;
  type: ASSEMBLIN_SENSOR_TYPE;
}



