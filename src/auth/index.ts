import {
  APIGatewayAuthorizerResult,
  APIGatewayRequestAuthorizerEvent,
} from "aws-lambda";

export const handler = async (
  event: APIGatewayRequestAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  console.log("Auth Lambda", event);

  console.log(event.headers, "event.authorizationToken");

  return {
    policyDocument: {
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Allow",
          Resource: event.methodArn,
        },
      ],
      Version: "2012-10-17",
    },
    principalId: "123456",
  };
};
