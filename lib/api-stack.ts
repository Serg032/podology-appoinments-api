import * as cdk from "aws-cdk-lib";
import {
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
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const authorizerLambda = new NodejsFunction(
      this,
      generateResourceName("AuthorizerLambda", scope),
      {
        functionName: generateResourceName("AuthorizerLambda", scope),
        entry: join(__dirname, "../src/auth/index.ts"),
        handler: "handler",
        runtime: Runtime.NODEJS_22_X,
      }
    );

    const authorizer = new RequestAuthorizer(
      this,
      generateResourceName("Authorizer", scope),
      {
        handler: authorizerLambda,
        identitySources: [IdentitySource.header("x-user-token")],
        authorizerName: generateResourceName("authorizer-name", scope),
      }
    );

    const api = new RestApi(
      this,
      generateResourceName("podologist-api", scope),
      {
        defaultMethodOptions: {
          authorizer: authorizer,
        },
      }
    );

    const users = api.root.addResource("users");

    users.addMethod("POST", new LambdaIntegration(props.createUserLambda));
  }
}
