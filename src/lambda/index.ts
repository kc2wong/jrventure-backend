// src/lambda.ts
import serverlessExpress from '@vendia/serverless-express';

import { logger } from '@util/logging-util';

import app from '../app';
import { db } from '../repo/db';
logger.info(`DB initialized: ${db}`);

export const handler = serverlessExpress({ app });
