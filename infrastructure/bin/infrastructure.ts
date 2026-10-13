#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { ItemStack } from '../lib/ItemStack';

const app = new cdk.App();
const stage: string = app.node.tryGetContext('stage') ?? 'dev';

new ItemStack(app, 'ItemStack-${stage}', {
  stage,
});
