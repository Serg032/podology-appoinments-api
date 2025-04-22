import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyResult } from "aws-lambda";

export const validateCreateClientUserCommand = async (
  client: DynamoDBClient,
  body: any
): Promise<APIGatewayProxyResult | boolean> => {
  if (!body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Body is required",
      }),
    };
  }
  if (!body.name) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Name is required",
      }),
    };
  }
  if (!body.surname) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Surname is required",
      }),
    };
  }
  if (!body.email) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Email is required",
      }),
    };
  }
  if (!body.password) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Password is required",
      }),
    };
  }

  const emailQuery = new QueryCommand({
    TableName: process.env.USER_TABLE,
    IndexName: "email-index",
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": {
        S: body.email,
      },
    },
  });

  const emailResponse = await client.send(emailQuery);
  if (emailResponse.Items && emailResponse.Items.length > 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Email already exists",
      }),
    };
  }

  if (body.password.length < 8) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Password must be at least 8 characters",
      }),
    };
  }

  return true;
};
