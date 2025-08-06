import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Handler } from "../../user/app/create/handler";
import { DynamoDbRepository } from "../../user/infrastructure/repository";
import { CreateCommand } from "../../user/domain";

const tableName = process.env.USER_TABLE_NAME;

if (!tableName) {
  throw new Error("USER_TABLE_NAME env variable is not set");
}

const repository = new DynamoDbRepository(tableName);
const createHandler = new Handler(repository);

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = event.body;

    if (!body) {
      throw new Error("There's no body");
    }

    const parsedBody = JSON.parse(body) as CreateCommand;
    
    console.log("EVENT BODY: ", parsedBody);

    await createHandler.handle(parsedBody);

    return {
      statusCode: 201,
      body: "User created",
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify((error as Error).message),
    };
  }
};
