import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class LinkedupBackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new s3.Bucket(this, 'JrVentureMediaApprovalBucket', {
      bucketName: 'jr-venture-media-approval-bucket',
      lifecycleRules: [
        {
          expiration: Duration.days(30),
          enabled: true,
        },
      ],
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY, // For dev/test only
      autoDeleteObjects: true, // Needs permissions for destroy
    });

    new s3.Bucket(this, 'JrVentureMediaPublicBucket', {
      bucketName: 'jr-venture-media-public-bucket',
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS, // ⚡ allow public access (required for static hosting)
    });

    const linkedupLambda = new lambdaNodejs.NodejsFunction(
      this,
      'LinkedupBackendLambda',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: 'src/lambda/index.ts', // points to your lambda handler
        handler: 'handler',
        timeout: Duration.seconds(30), // 👈 Increase timeout here
        memorySize: 512,
        environment: {
          PORT: '3000', // not really needed, but some ORMs require PORT
          DATABASE_URL: process.env.DATABASE_URL!, // 👈 inject your Supabase DB URL
          GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
        },
        bundling: {
          nodeModules: ['prisma', '@prisma/client'],
          commandHooks: {
            beforeBundling(_inputDir: string, _outputDir: string): string[] {
              return [];
            },
            beforeInstall(inputDir: string, outputDir: string) {
              return [`cp -r ${inputDir}/prisma ${outputDir}`];
            },
            afterBundling(inputDir: string, outputDir: string): string[] {
              return [
                'yarn install', // Reinstall to ensure all dependencies are bundled
                'yarn prisma generate', // Regenerate Prisma Client in the bundled directory
              ];
              // return [];
            },
          },
        },
      }
    );

    new apigateway.LambdaRestApi(this, 'LinkedupBackendApi', {
      handler: linkedupLambda,
      proxy: true,
    });
  }
}
