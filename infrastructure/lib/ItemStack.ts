import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as path from 'path';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export interface ItemStackProps extends cdk.StackProps {
  stage: string; // e.g. 'dev' or 'prod'
}

export class ItemStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ItemStackProps) {
    super(scope, id, props);

    const api = new apigateway.RestApi(this, 'ItemsApi', {
      restApiName: `items-api-${props.stage}`,
    });
  }
}
