import * as cdk from "aws-cdk-lib";
import { RequestAuthorizer } from "aws-cdk-lib/aws-apigateway";
import { TableV2 } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import "dotenv/config";
import { join } from "path";

interface LambdaStackProps extends cdk.StackProps {
  userTable: TableV2;
}

export class LambdaStack extends cdk.Stack {
  public readonly authorizer: RequestAuthorizer;
  public readonly createUser: NodejsFunction;
  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const createUser = new NodejsFunction(
      this,
      `Podologist-Create-UserLambda-${process.env.ENV}`,
      {
        functionName: `Podologist-Create-UserLambda-${process.env.ENV}`,
        runtime: Runtime.NODEJS_22_X,
        entry: join(__dirname, "../src/user/app/create.ts"),
        handler: "handler",
        environment: {
          USER_TABLE: props.userTable.tableName,
        },
      }
    );

    this.createUser = createUser;
  }
}
