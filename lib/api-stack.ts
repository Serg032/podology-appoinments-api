import * as cdk from "aws-cdk-lib";
import {
  Cors,
  IdentitySource,
  LambdaIntegration,
  RequestAuthorizer,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { generateResourceName } from "../src/utils/generate-resouce-name";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { join } from "path";
import { Runtime } from "aws-cdk-lib/aws-lambda";

interface ApiStackProps extends cdk.StackProps {
  createUserLambda: NodejsFunction;
  getUserByIdLambda: NodejsFunction;
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const authorizerLambda = new NodejsFunction(
      this,
      generateResourceName("authorizerLambda", "function"),
      {
        functionName: generateResourceName("authorizerLambda", "function"),
        entry: join(__dirname, "../src/auth/index.ts"),
        handler: "handler",
        runtime: Runtime.NODEJS_22_X,
      }
    );

    const authorizer = new RequestAuthorizer(
      this,
      generateResourceName("authorizer", "requestAuthorizer"),
      {
        handler: authorizerLambda,
        identitySources: [IdentitySource.header("x-user-token")],
        authorizerName: generateResourceName("authorizer", "requestAuthorizer"),
      }
    );

    const api = new RestApi(this, generateResourceName("api", "restApi"), {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    });

    const users = api.root.addResource("users");
    const user = users.addResource("{id}");

    users.addMethod("POST", new LambdaIntegration(props.createUserLambda), {});
    user.addMethod("GET", new LambdaIntegration(props.getUserByIdLambda), {
      authorizer,
    });
  }
}
