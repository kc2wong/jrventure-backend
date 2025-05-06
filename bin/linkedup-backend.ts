import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.production' });

console.log(`process.env.DATABASE_URL = ${process.env.DATABASE_URL}`)
import * as cdk from 'aws-cdk-lib';
import { LinkedupBackendStack } from '../lib/linkedup-backend-stack';

const app = new cdk.App();
new LinkedupBackendStack(app, 'LinkedupBackendStack');
