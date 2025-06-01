import * as cdk from "aws-cdk-lib";
import {
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
      generateResourceName("authorizer-lambda", scope),
      {
        functionName: generateResourceName(
          "authorizer-lambda-function-name",
          scope
        ),
        entry: join(__dirname, "../src/auth/index.ts"),
        handler: "handler",
        runtime: Runtime.NODEJS_22_X,
      }
    );

    const authorizer = new RequestAuthorizer(
      this,
      generateResourceName("authorizer", scope),
      {
        handler: authorizerLambda,
        identitySources: ["method.request.header.x-user-token"],
        authorizerName: generateResourceName("authorizer-name", scope),
      }
    );

    const api = new RestApi(this, generateResourceName("api", scope), {
      defaultMethodOptions: {
        authorizer: authorizer,
      },
    });

    const users = api.root.addResource("users");

    users.addMethod("POST", new LambdaIntegration(props.createUserLambda));
  }
}
