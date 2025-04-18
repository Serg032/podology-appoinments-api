import * as cdk from "aws-cdk-lib";
import { AttributeType, TableV2 } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import "dotenv/config";

export class TableStack extends cdk.Stack {
  public userTable: TableV2;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userTable = new TableV2(this, `UserTable-${process.env.ENV}`, {
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
