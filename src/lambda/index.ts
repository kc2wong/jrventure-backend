// src/lambda.ts
import serverlessExpress from '@vendia/serverless-express';
import app from '../app';

import { db } from '../repo/db';
console.log('DB initialized:', db);

export const handler = serverlessExpress({ app });
