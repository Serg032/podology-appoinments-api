import * as cdk from "aws-cdk-lib";
import { AttributeType, TableV2 } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import "dotenv/config";
import { generateResourceName } from "../src/utils/generate-resouce-name";

export class TableStack extends cdk.Stack {
  public userTable: TableV2;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userTable = new TableV2(
      this,
      generateResourceName("userTable", "table"),
      {
        tableName: generateResourceName("userTable", "table"),
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
        removalPolicy: cdk.RemovalPolicy.DESTROY, // Use DESTROY for development, change to RETAIN for production
      }
    );

    this.userTable = userTable;
  }
}
