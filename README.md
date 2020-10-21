# assemblin-connector

Assemblin connector allows retrieving "Temperature" and "CO2" values in response for the Property and Room parameters combination.


## Getting Started

These instructions will get you a copy of the connector up and running.

### Prerequisites

Start by installing required packages:
```
npm install
```

Mandatory environment variables are:
```
TRANSLATOR_DOMAIN
```

Set environmet variables by executing a container with an ```.env``` file attached like so:
```
docker run -p 8080:8080 --env-file ~/Path/to/.env  metatavu/digitransit:2020-09-30_135500-test
```

Contents of ```.env``` file are the following:
```
ASSEMBLIN_SERVER_URL=[URL]
ASSEMBLIN_USER_NAME=[username]
ASSEMBLIN_USER_PASSWORD=[password]
TRANSLATOR_DOMAIN=[URL depens on env]
```

### PoT Public Keys

Pot Public Keys can be configured from

```
config/definitions/pot.js
```

## Request body examples

Below are few examples of a Digitransit request body and parameters

```
{
	"parameters":{
      "ids":[
         {
            "idProperty": "AI200",
            "idRoom": "A4019c"
         }
      ],
      "dataTypes":[
		  "MeasureAirCO2LevelPPM", 
		  "MeasureAirTemperatureCelsiusDegree"
      ]
   },
   "@context": "https://standards-ontotest.oftrust.net/v2/Context/DataProductContext/Sensor/",
   "timestamp": "2020-09-28T11:32:00+03:00",
   "productCode": "assemblin-test-1"
}
```

## Tests

See /robottests for tests and description.



