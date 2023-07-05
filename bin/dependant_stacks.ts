#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { producingStack } from '../lib/producingStack';
import {consumingStack} from "../lib/consumingStack";

const app = new cdk.App();
const producer = new producingStack(app, 'producingStack', {
});

/**
 * ConsumingStack uses output from producingStack, creating an implicit dependency managed by CDK
 */
new consumingStack(app, 'consumingStack', {
    sqsArn: producer.sourceQueueArn,
    sqsUrl: producer.sourceQueueUrl
});
