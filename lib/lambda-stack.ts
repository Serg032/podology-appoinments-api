import * as cdk from "aws-cdk-lib";
import { ITableV2 } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import "dotenv/config";
import { join } from "path";
import { generateResourceName } from "../src/utils/generate-resouce-name";

interface LambdaStackProps extends cdk.StackProps {
  userTable: ITableV2;
}

export class LambdaStack extends cdk.Stack {
  public readonly createUserLambda: NodejsFunction;
  public readonly getUserByIdLambda: NodejsFunction;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const registerUserLambda = new NodejsFunction(
      this,
      generateResourceName("registerUser", "function"),
      {
        functionName: generateResourceName("registerUser", "function"),
        entry: join(__dirname, "../src/app/user/register.ts"),
        runtime: Runtime.NODEJS_22_X,
        environment: {
          USER_TABLE_NAME: props.userTable.tableName,
        },
      }
    );

    const getUserByIdLambda = new NodejsFunction(
      this,
      generateResourceName("getUserById", "function"),
      {
        functionName: generateResourceName("getUserById", "function"),
        entry: join(__dirname, "../src/app/user/get-by-id.ts"),
        runtime: Runtime.NODEJS_22_X,
        environment: {
          USER_TABLE_NAME: props.userTable.tableName,
        },
      }
    );

    props.userTable.grantReadWriteData(registerUserLambda);
    props.userTable.grantReadData(getUserByIdLambda);

    this.createUserLambda = registerUserLambda;
    this.getUserByIdLambda = getUserByIdLambda;
  }
}
