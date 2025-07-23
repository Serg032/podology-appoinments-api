import {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { randomUUID } from "crypto";
import { CreateUserCommand, User, UserType } from "../domain";
import { Repository } from "../domain/repository-interface";
import { MoreThanOneUserWithSameEmail } from "../domain/error/user-with-same-email";

export class DynamoDbRepository implements Repository {
  private dbClient: DynamoDBClient;
  private tableName: string;

  constructor(userTableName: string) {
    this.dbClient = new DynamoDBClient();
    this.tableName = userTableName;
    console.log("Repository initialized with table name:", this.tableName);
  }

  public async save(command: CreateUserCommand) {
    try {
      await this.dbClient.send(
        new PutItemCommand({
          TableName: this.tableName,
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
              S: command.type,
            },
          },
        })
      );
    } catch (error) {
      console.error(error);
      throw new Error(
        `Error saving user in DynamoDb ${(error as Error).message}`
      );
    }
  }

  public async getByEmail(email: string): Promise<User | undefined> {
    const response =
      (
        await this.dbClient.send(
          new QueryCommand({
            TableName: this.tableName,
            KeyConditionExpression: "email-index = email",
            ExpressionAttributeValues: {
              email: {
                S: email,
              },
            },
          })
        )
      ).Items ?? [];

    if (response.length === 0) {
      return;
    }

    if (response.length > 1) {
      throw new MoreThanOneUserWithSameEmail(email);
    }

    const unmarshalledResponse = response[0];

    console.log(unmarshalledResponse);

    return new User("1", "1", "1", "1", "1", UserType.client);
  }
}
