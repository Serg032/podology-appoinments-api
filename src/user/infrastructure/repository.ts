import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { Repository } from "../domain/repository-interface";
import { UserDto } from "../domain";
import { User } from "../domain/entity";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export class DynamoDbRepository implements Repository {
  private dbClient: DynamoDBClient;
  private tableName: string;

  constructor(userTableName: string) {
    this.dbClient = new DynamoDBClient();
    this.tableName = userTableName;
  }

  public async save(user: User) {
    try {
      await this.dbClient.send(
        new PutItemCommand({
          TableName: this.tableName,
          Item: {
            id: {
              S: user.id,
            },
            name: {
              S: this.capitalizeFirstLetter(user.name),
            },
            surname: {
              S: this.capitalizeFirstLetter(user.surname),
            },
            email: {
              S: user.email.toLocaleLowerCase().trim(),
            },
            password: {
              S: user.password,
            },
            type: {
              S: user.type,
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

  async getById(id: string): Promise<UserDto | undefined> {
    const item = (
      await this.dbClient.send(
        new GetItemCommand({
          Key: {
            id: {
              S: id,
            },
          },
          TableName: this.tableName,
        })
      )
    ).Item;

    if (!item) {
      return;
    }

    const unmarshalledItem = unmarshall(item);

    return {
      id: unmarshalledItem.id,
      name: unmarshalledItem.name,
      surname: unmarshalledItem.surname,
      email: unmarshalledItem.email,
      type: unmarshalledItem.type,
      password: unmarshalledItem.password,
    };
  }

  public async getByEmail(email: string): Promise<UserDto | undefined> {
    const response =
      (
        await this.dbClient.send(
          new QueryCommand({
            TableName: this.tableName,
            IndexName: "email-index",
            KeyConditionExpression: "email = :email",
            ExpressionAttributeValues: {
              ":email": {
                S: email,
              },
            },
          })
        )
      ).Items ?? [];

    if (response.length === 0) {
      return;
    }

    const unmarshalledItem = unmarshall(response[0]);

    return {
      id: unmarshalledItem.id,
      name: unmarshalledItem.name,
      surname: unmarshalledItem.surname,
      email: unmarshalledItem.email,
      type: unmarshalledItem.type,
      password: unmarshalledItem.password,
    };
  }
  private capitalizeFirstLetter(str: string) {
    return (
      str.charAt(0).toLocaleUpperCase() + str.slice(1).toLocaleLowerCase()
    ).trim();
  }
}
