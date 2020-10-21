/**
 * Module dependencies.
 */

import express from 'express';
import { PassportStatic } from 'passport';
const router = express.Router();
import { apiRoutes } from './v1';

/**
 * Version routes.
 */
export const v1Endpoints = (passport: PassportStatic) => {
  /** V1 endpoints. */
  router.use('/v1/', apiRoutes(passport));
  return router;
};
