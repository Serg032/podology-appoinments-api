#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { ApiStack } from "../lib/api-stack";
import { generateResourceName } from "../src/utils/generate-resouce-name";
import { LambdaStack } from "../lib/lambda-stack";
import { TableStack } from "../lib/table-stack";

const app = new cdk.App();
const tableStack = new TableStack(
  app,
  generateResourceName("Podologist-table-stack"),
  {}
);
const lambdaStack = new LambdaStack(
  app,
  generateResourceName("Podologist-lambda-stack"),
  {
    tableName: tableStack.userTable.tableName,
  }
);
new ApiStack(app, generateResourceName("Podologist-api-stack"), {
  createUserLambda: lambdaStack.createUserLambda,
});
