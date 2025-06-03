import { validateCreateClientUserCommand } from "./validate-create-client-user-command";
import { Repository } from "../../infrastructure/repository";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as bcrypt from "bcryptjs";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log(
      "Event received:",
      event,
      "Table Name:",
      process.env.USER_TABLE_NAME
    );

    const tableName = process.env.USER_TABLE_NAME;
    if (!tableName) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "USER_TABLE_NAME environment variable is not set",
        }),
      };
    }

    // Initialize the repository with the table name
    const repository = new Repository(tableName);

    const body = event.body;

    if (!body) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Body is required",
        }),
      };
    }

    const parsedBody = JSON.parse(body);

    const validationResponse = await validateCreateClientUserCommand(
      parsedBody
    );

    if (validationResponse.result === false) {
      console.log("Validation failed", validationResponse);
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: validationResponse.message || "Validation failed",
        }),
      };
    }

    const hashedPassword = await bcrypt.hash(
      parsedBody.password,
      process.env.BCRYPT_SALT_ROUNDS || 10
    );

    const createdClient = await repository.createClient({
      ...parsedBody,
      password: hashedPassword,
    });

    if (!createdClient) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Failed to create user",
        }),
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...clientResponse } = parsedBody;

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "User created successfully",
        user: clientResponse,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal server error",
        error: JSON.stringify(error),
      }),
    };
  }
};
