import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Create User Lambda", process.env.USER_TABLE);
  console.log("EVENT", event);

  return Promise.resolve({
    statusCode: 200,
    body: JSON.stringify({
      message: "User created",
      input: event,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
