import * as cdk from "aws-cdk-lib";
import { AttributeType, TableV2 } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import "dotenv/config";

export class TableStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new TableV2(this, `UserTable-${process.env.ENV}`, {
      tableName: `UserTable-${process.env.ENV}`,
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      globalSecondaryIndexes: [
        {
          indexName: "email-index",
          partitionKey: {
            name: "email",
            type: AttributeType.STRING,
          },
        },
      ],
    });
  }
}
