import { StackProps } from 'aws-cdk-lib';

export interface ConsumingStackProps extends StackProps {
    readonly sqsArn: string;
    readonly sqsUrl: string;
}
