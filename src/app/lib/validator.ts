"use strict";
/**
 * Module dependencies.
 */
import _ from 'lodash';

/**
 * Validator library.
 *
 * Handles request validation.
 */

/**
 * Validates target object by given schema.
 *
 * @param {Object} target
 * @param {Object} schema
 * @return {Object}
 *   Validation object.
 */
export const validate = function (target: any, schema: any) {
  let result;
  let error;
  const missing = [];
  const wrong = [];
  for (let parameter in schema) {
    if (Object.hasOwnProperty.call(schema, parameter)) {
      if (!_.get(target, parameter)) {
        if (schema[parameter].required) missing.push(parameter);
      } else if (typeof _.get(target, parameter) != "string" && parameter !== "parameters" && parameter !== "parameters.ids" && parameter !== "parameters.dataTypes") {
        wrong.push(parameter);
      } else if (typeof _.get(target, parameter) !== "object" && parameter === "parameters.dataTypes" && parameter) {
        wrong.push("parameters.dataTypes");
      }
    }
  }
  if (missing.length > 0) {
    result = false;
    error = Object.assign({}, ...missing.map((p) => {
      return { [p]: ['Missing data for required field.'] }
    }));
  }
  if (wrong.length > 0) {
    result = false;
    error = Object.assign({}, ...wrong.map((p) => {
      return { [p]: ['Wrong data format for a field.'] }
    }));
  }
  return {
    result,
    error
  }
};
