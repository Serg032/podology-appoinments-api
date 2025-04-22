import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { randomUUID } from "crypto";
import { CreateClientUserCommand, UserType } from "../../domain";
import { validateCreateClientUserCommand } from "./validate-create-client-user-command";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("create user");
  console.log(process.env.USER_TABLE);

  if (!event.body) {
    throw new Error("Body is required");
  }
  const body = JSON.parse(event.body) as CreateClientUserCommand;

  const dbClient = new DynamoDBClient();

  const validationResponse = await validateCreateClientUserCommand(
    dbClient,
    body
  );

  if (typeof validationResponse !== "boolean") {
    return validationResponse as APIGatewayProxyResult;
  }

  const command = new PutItemCommand({
    TableName: process.env.USER_TABLE,
    Item: {
      id: {
        S: randomUUID(),
      },
      name: {
        S: body.name,
      },
      surname: {
        S: body.surname,
      },
      email: {
        S: body.email,
      },
      password: {
        S: body.password,
      },
      type: {
        S: UserType.client,
      },
    },
  });

  await dbClient.send(command);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "User created",
    }),
  };
};
