import * as cdk from "aws-cdk-lib";
import { ITableV2 } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import "dotenv/config";
import { join } from "path";
import { generateResourceName } from "../src/utils/generate-resouce-name";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

interface LambdaStackProps extends cdk.StackProps {
  userTable: ITableV2;
}

export class LambdaStack extends cdk.Stack {
  public readonly createUserLambda: NodejsFunction;
  public readonly getUserByIdLambda: NodejsFunction;
  private jwtPrivateKeyName: string;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    this.jwtPrivateKeyName = "/podologist-authentication-service/jwt-secret";

    const registerUserLambda = new NodejsFunction(
      this,
      generateResourceName("registerUser", "function"),
      {
        functionName: generateResourceName("registerUser", "function"),
        entry: join(__dirname, "../src/app/user/register.ts"),
        runtime: Runtime.NODEJS_22_X,
        environment: {
          USER_TABLE_NAME: props.userTable.tableName,
          JWT_SECRET_PARAMETER_NAME: this.jwtPrivateKeyName,
        },
        timeout: cdk.Duration.seconds(5),
      }
    );

    registerUserLambda.addToRolePolicy(
      new PolicyStatement({
        actions: [
          "ssm:GetParameter",
          "ssm:GetParameters",
          "ssm:DescribeParameters",
        ],
        resources: [
          `arn:aws:ssm:${cdk.Stack.of(this).region}:${
            cdk.Stack.of(this).account
          }:parameter/podologist-authentication-service/jwt-secret`,
        ],
      })
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
