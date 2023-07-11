import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {ConsumingStackProps} from "./consumingStackProps";
import {SqsEventSource} from "aws-cdk-lib/aws-lambda-event-sources";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {aws_lambda, aws_sqs} from "aws-cdk-lib";

export class consumingStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: ConsumingStackProps) {
        // ConsumingStackProps used to pass refs from producingStack as props

        super(scope, id, props);

        // Get ref to existing SQS created by producingStack
        const queue = aws_sqs.Queue.fromQueueArn(this, 'sourceQ', props.sqsArn);

        // Set the producingStacks SQS as an event source for our lambda
        const eventSource = new SqsEventSource(queue, {
            batchSize: 10,
            reportBatchItemFailures : true,
            enabled: true
        });

        // Use URL of producingStack SQS in environment var for our lambda
        const lambdaEnvVars = {
             SQS_QUEUE_URL: props.sqsUrl
        };

        // Actual lambda - just for example so doesn't actually do anything useful
        const processingLambda = new NodejsFunction(this, 'processingLambda', {
            entry: './lambda/index.ts',
            runtime: aws_lambda.Runtime.NODEJS_18_X,
            handler: 'main',
            environment: lambdaEnvVars
        });

        processingLambda.addEventSource(eventSource);
    }
}
