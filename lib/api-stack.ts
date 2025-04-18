import * as cdk from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { generateResourceName } from "../src/utils/generate-resouce-name";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

interface ApiStackProps extends cdk.StackProps {
  createUserLambda: NodejsFunction;
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const api = new RestApi(this, generateResourceName("podologist-api"), {});

    const users = api.root.addResource("users");

    users.addMethod("POST", new LambdaIntegration(props.createUserLambda));
  }
}
