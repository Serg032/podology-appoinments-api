#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { ApiStack } from "../lib/api-stack";
import { TableStack } from "../lib/table-stack";
import { LambdaStack } from "../lib/lambda-stack";

const app = new cdk.App();

const tableStack = new TableStack(
  app,
  `Podologist-TableStack-${process.env.ENV}`,
  {}
);
const lambdaStack = new LambdaStack(
  app,
  `Podologist-LambdaStack-${process.env.ENV}`,
  {
    userTable: tableStack.userTable,
  }
);
new ApiStack(app, `Podologist-ApiStack-${process.env.ENV}`, {
  createUser: lambdaStack.createUser,
});
