import * as cdk from "aws-cdk-lib";
import {
  LambdaIntegration,
  RequestAuthorizer,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { join } from "path";
import { Runtime } from "aws-cdk-lib/aws-lambda";

interface ApiStackProps extends cdk.StackProps {
  createUser: NodejsFunction;
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const api = new RestApi(
      this,
      `Podologist-AppointmentsApi-${process.env.ENV}`,
      {}
    );

    const resource = api.root.addResource("users", {});

    const authorizer = new RequestAuthorizer(
      this,
      "Podologist-RequestAuthorizer",
      {
        handler: new NodejsFunction(
          this,
          `Podologist-AuthLambda-${process.env.ENV}`,
          {
            functionName: `Podologist-AuthLambda-${process.env.ENV}`,
            runtime: Runtime.NODEJS_22_X,
            entry: join(__dirname, "../src/auth/index.ts"),
            handler: "handler",
          }
        ),
        identitySources: ["context.stage"], // Valor genérico
      }
    );
    // Add a method to pass the environment variable as an identity source
    resource.addMethod("POST", new LambdaIntegration(props.createUser), {
      authorizer: authorizer,
    });
  }
}
