#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { LinkedupBackendStack } from '../lib/linkedup-backend-stack';

const app = new cdk.App();
new LinkedupBackendStack(app, 'LinkedupBackendStack');
