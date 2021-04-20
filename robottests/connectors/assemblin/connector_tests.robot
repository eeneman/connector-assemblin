*** Settings ***
Documentation     Assemblin Temperature / CO2 sensors
Library           Collections
Library           DateTime
Library           PoTLib
Library           REST         ${API_URL}

*** Variables ***
${LOCAL_TZ}                  +02:00
${TEST_ENV}                  test
${API_URL}                   https://api-${TEST_ENV}.oftrust.net
${API_PATH}                  /broker/v1/fetch-data-product
${CONNECTOR_URL}             http://localhost:8080
${CONNECTOR_PATH}            /assemblin/translator/v1/fetch
${APP_TOKEN}                 %{POT_APP_ACCESS_TOKEN}
${CLIENT_SECRET}             %{POT_CLIENT_SECRET}
${PRODUCT_CODE}             %{POT_PRODUCT_CODE}
${ID_PROPERTY}               AI200
${ID_ROOM}                   A4018

${DATA_TYPE_1}               MeasureAirCO2LevelPPM
${DATA_TYPE_2}               MeasureAirTemperatureCelsiusDegree
${DATA_TYPE_3}               MeasureAirHumidityPercent
${DATA_TYPE_4}               MeasureOccupancy

&{IDS_PARAMETERS}            idProperty=${ID_PROPERTY}
...                          idRoom=${ID_ROOM}

@{IDS_ARRAY}                 &{IDS_PARAMETERS}

@{DATA_TYPES_LIST}           ${DATA_TYPE_1}
...                          ${DATA_TYPE_2}
...                          ${DATA_TYPE_3}
...                          ${DATA_TYPE_4}

# @{DATA_TYPES}                &{DATA_TYPES_LIST}

&{BROKER_BODY_PARAMETERS}    ids=@{IDS_ARRAY}
...                          dataTypes=@{DATA_TYPES_LIST}

&{BROKER_BODY}               productCode=${PRODUCT_CODE}
...                          parameters=${BROKER_BODY_PARAMETERS}

*** Keywords ***
Fetch Data Product
    [Arguments]     ${body}
    ${signature}    Calculate PoT Signature          ${body}    ${CLIENT_SECRET}
    Log             ${signature}
    Set Headers     {"x-pot-signature": "${signature}", "x-app-token": "${APP_TOKEN}"}
    POST            ${API_PATH}                ${body}
    Output schema   response body

Get Body
    [Arguments]          &{kwargs}
    ${body}              Copy Dictionary      ${BROKER_BODY}    deepcopy=True
    ${now}               Get Current Date     time_zone=UTC     result_format=%Y-%m-%dT%H:%M:%S+00:00
    Set To Dictionary    ${body}              timestamp         ${now}
    Set To Dictionary    ${body}              &{kwargs}
    ${json_string}=      evaluate             json.dumps(${body})   json
    [Return]             ${body}

Fetch Data Product With Timestamp
    [Arguments]            ${increment}       ${time_zone}=UTC      ${result_format}=%Y-%m-%dT%H:%M:%S.%fZ
    ${timestamp}           Get Current Date
    ...                    time_zone=${time_zone}
    ...                    result_format=${result_format}
    ...                    increment=${increment}
    ${body}                Get Body                       timestamp=${timestamp}
    Fetch Data Product     ${body}

Fetch Data Product With Timestamp 200
    [Arguments]            ${increment}       ${time_zone}=UTC      ${result_format}=%Y-%m-%dT%H:%M:%S.%fZ
    Fetch Data Product With Timestamp         ${increment}    ${time_zone}    ${result_format}
    Integer                response status                200
    Array                  response body data items       minItems=2

Fetch Data Product With Timestamp 422
    [Arguments]            ${increment}
    Fetch Data Product With Timestamp         ${increment}
    Integer    response status                422
    Integer    response body error status     422
    String     response body error message    Request timestamp not within time frame.

*** Test Cases ***
fetch, 200
    [Tags]                bug-0001
    ${body}               Get Body
    Fetch Data Product    ${body}
    Integer               response status                                                           200
    String                response body @context                                                    https://standards-ontotest.oftrust.net/v2/Context/DataProductOutput/Sensor/
    Object                response body data
    Array                 response body data sensors
    Array                 response body data sensors 0 measurements
    Object                response body data sensors 0 id

fetch, 422, Missing data for timestamp required field
    [Tags]                 bug-0001
    ${body}                Get Body
    Pop From Dictionary    ${body}                              timestamp
    Fetch Data Product     ${body}
    Integer    response status                                  422
    Integer    response body error status                       422
    String     response body error message timestamp 0          Missing data for required field.

fetch, 422, Missing data for parameters required field
    [Tags]                 bug-0002
    ${body}                Get Body
    Pop From Dictionary    ${body}                              parameters
    Fetch Data Product     ${body}
    Integer    response status                                  502
    Integer    response body error status                       502
    Integer    response body error translator_response status   422
    String     response body error translator_response data error message parameters 0         Missing data for required field.

fetch, 422, Missing data for ids required field
    [Tags]                 bug-0003
    ${body}                Get Body
    Pop From Dictionary    ${body["parameters"]}                            ids
    Fetch Data Product     ${body}
    Integer    response status                                              502
    Integer    response body error status                                   502
    Integer    response body error translator_response status               422
    String     response body error translator_response data error message parameters.ids 0                    Missing data for required field.
    String     response body error translator_response data error message parameters.ids[0].idRoom 0          Missing data for required field.
    String     response body error translator_response data error message parameters.ids[0].idProperty 0      Missing data for required field.

fetch, 422, Missing data for dataTypes required field
    [Tags]                 bug-0004
    ${body}                Get Body
    Pop From Dictionary    ${body["parameters"]}                            dataTypes
    Fetch Data Product     ${body}
    Integer    response status                                              502
    Integer    response body error status                                   502
    Integer    response body error translator_response status               422
    String     response body error translator_response data error message parameters.dataTypes 0             Missing data for required field.
    String     response body error translator_response data error message parameters.dataTypes[0] 0          Missing data for required field.

fetch, 422, Empty ids
    [Tags]                 bug-0005
    ${body}                Get Body
    Set To Dictionary      ${body["parameters"]}                ids=@{EMPTY}
    Fetch Data Product     ${body}
    Integer    response status                                              502
    Integer    response body error status                                   502
    Integer    response body error translator_response status               422
    String     response body error translator_response data error message parameters.ids[0].idRoom 0          Missing data for required field.
    String     response body error translator_response data error message parameters.ids[0].idProperty 0      Missing data for required field.

fetch, 422, Empty dataTypes
    [Tags]                 bug-0006
    ${body}                Get Body
    Set To Dictionary      ${body["parameters"]}                dataTypes=@{EMPTY}
    Fetch Data Product     ${body}
    Integer    response status                                              502
    Integer    response body error status                                   502
    Integer    response body error translator_response status               422
    String     response body error translator_response data error message parameters.dataTypes[0] 0          Missing data for required field.
