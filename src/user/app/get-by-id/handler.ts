import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Repository } from "../../infrastructure/repository";

const respository = new Repository(process.env.USER_TABLE_NAME || "");
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "User ID is required",
        }),
      };
    }

    const user = await respository.getByEmail(id);

    console.log("User found:", user);

    return {
      statusCode: 200,
      body: JSON.stringify({
        user: JSON.stringify(user),
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to get user by id",
        error: JSON.stringify(error),
      }),
    };
  }
};
