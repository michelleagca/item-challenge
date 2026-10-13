import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { CfnOutput } from 'aws-cdk-lib';
import * as path from 'path';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export interface ItemStackProps extends cdk.StackProps {
  stage: string; // e.g. 'dev' or 'prod'
}

export class ItemStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ItemStackProps) {
    super(scope, id, props);

    /**
     * ====================================================
     * DynamoDB
     *
     * Default billing option is om-demand PAY_PER_REQUEST.
     * ====================================================
     */

    const itemsTable = new dynamodb.Table(this, 'ItemsTable', {
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
    });

    itemsTable.addGlobalSecondaryIndex({
      indexName: 'GSI1',
      partitionKey: { name: 'GSI1PK', type: dynamodb.AttributeType.STRING }, // status
      sortKey: { name: 'GSI1SK', type: dynamodb.AttributeType.STRING }, // lastModified
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // TODO: Create a separate Audit Trail table to push audit events such as creation, updates, versioning

    /**
     * ====================================================
     * Lambda functions
     *
     * The NodejsFunction construct creates a Lambda function with automatic transpiling
     * and bundling of TypeScript or Javascript code. This results in smaller Lambda
     * packages that contain only the code and dependencies needed to run the function.
     * https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_lambda_nodejs/README.html#node-js-function
     * ====================================================
     */
    const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
    const HANDLERS_DIR_PATH = path.join(PROJECT_ROOT, 'src', 'handlers');

    const createItemFn = new NodejsFunction(this, 'CreateItemFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: path.join(HANDLERS_DIR_PATH, '/createItem.ts'),
      projectRoot: PROJECT_ROOT,
      handler: 'handler',
      environment: {
        USE_DYNAMODB: 'true',
        DYNAMODB_TABLE_NAME: itemsTable.tableName,
      },
    });

    const getItemFn = new NodejsFunction(this, 'GetItemFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: path.join(HANDLERS_DIR_PATH, '/getItem.ts'),
      projectRoot: PROJECT_ROOT,
      handler: 'handler',
      environment: {
        USE_DYNAMODB: 'true',
        DYNAMODB_TABLE_NAME: itemsTable.tableName,
      },
    });

    /**
     * ====================================================
     * IAM / Auth
     *
     * Least-privilege to limit operations each lambda function has
     * TODO: Add authorizers
     * ====================================================
     */

    itemsTable.grant(createItemFn, 'dynamodb:PutItem');
    itemsTable.grant(getItemFn, 'dynamodb:GetItem');

    /**
     * ====================================================
     * API Gateway: REST APIs
     * ====================================================
     */

    const api = new apigateway.RestApi(this, 'ItemsApi', {
      restApiName: `items-api-${props.stage}`,
      description: 'Exam item management API',
      cloudWatchRole: true,
      deployOptions: {
        stageName: props.stage,
        metricsEnabled: true,
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
      },
      defaultCorsPreflightOptions: {
        // Currently same as in /src/server.ts
        allowOrigins: ['*'],
        allowMethods: ['GET', 'POST', 'PUT', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    const items = api.root.addResource('api').addResource('items');
    items.addMethod('POST', new apigateway.LambdaIntegration(createItemFn));
    const item = items.addResource('{id}');
    item.addMethod('GET', new apigateway.LambdaIntegration(getItemFn));

    /**
     * ====================================================
     * Cloudwatch: Monitoring
     * TODO: Add logging and alarms
     * ====================================================
     */

    /**
     * ====================================================
     * Outputs
     * ====================================================
     */

    new CfnOutput(this, 'ApiUrl', { value: api.url });
    new CfnOutput(this, 'ItemsTableName', { value: itemsTable.tableName });
  }
}
