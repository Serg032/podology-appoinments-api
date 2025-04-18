import * as cdk from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import "dotenv/config";
import { join } from "path";

interface LambdaStackProps extends cdk.StackProps {
  tableName: string;
}

export class LambdaStack extends cdk.Stack {
  public createUserLambda: NodejsFunction;
  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const createUserLambda = new NodejsFunction(
      this,
      `Create-UserLambda-${process.env.ENV}`,
      {
        functionName: `Create -UserLambda-${process.env.ENV}`,
        entry: join(__dirname, "../src/user/app/create.ts"),
        handler: "handler",
        environment: {
          USER_TABLE: props.tableName,
        },
      }
    );

    this.createUserLambda = createUserLambda;
  }
}
