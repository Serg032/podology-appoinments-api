import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandOutput,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { randomUUID } from "crypto";
import { CreateClientUserCommand, UserType } from "../domain";

export class Repository {
  private dbClient: DynamoDBClient;
  private userTableName: string;

  constructor(userTableName: string) {
    this.dbClient = new DynamoDBClient();
    this.userTableName = userTableName;
    console.log("Repository initialized with table name:", this.userTableName);
  }
  async createClient(
    command: CreateClientUserCommand
  ): Promise<PutItemCommandOutput> {
    return await this.dbClient.send(
      new PutItemCommand({
        TableName: this.userTableName,
        Item: {
          id: {
            S: randomUUID(),
          },
          name: {
            S: command.name,
          },
          surname: {
            S: command.surname,
          },
          email: {
            S: command.email,
          },
          password: {
            S: command.password,
          },
          type: {
            S: UserType.client,
          },
        },
      })
    );
  }

  async getByEmail(email: string) {
    const emailQuery = new QueryCommand({
      TableName: this.userTableName,
      IndexName: "email-index",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": {
          S: email,
        },
      },
    });

    return this.dbClient.send(emailQuery);
  }
}
