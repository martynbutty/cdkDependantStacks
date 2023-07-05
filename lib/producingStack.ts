import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';

export class producingStack extends cdk.Stack {
  public readonly sourceQueueArn: string;
  public readonly sourceQueueUrl: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const sourceMessageQueue = new sqs.Queue(this, 'sourceMessageQueue', {
      queueName: 'sourceMessageQueue'
    });

    // After creating the SQS, add the required properties to be used in consumingStack to our public fields
    this.sourceQueueArn = sourceMessageQueue.queueArn;
    this.sourceQueueUrl = sourceMessageQueue.queueUrl;

    /**
     * Dummy exports.
     * Use this code to decouple the stacks. This code prevents the exports from being removed from the
     * cloudformation templates, thus allowing a deployment of producingStack against the previously deployed
     * consumingStack, which still needs these exports.
     * Once the ref to this queue is removed from consumingStack, these dummy exports can then be removed in a
     * second change and deploy.
     */
    // We need an export on the QueueArn used by sqsSendMessagesPolicy
    this.exportValue(sourceMessageQueue.queueArn);
    // and an export of the queue URL used as a env var in lambda handler
    this.exportValue(sourceMessageQueue.queueUrl);
  }
}
