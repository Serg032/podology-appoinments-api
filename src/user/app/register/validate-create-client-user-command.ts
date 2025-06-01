import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { CreateClientUserValidationResponse } from "../../domain";
import { Repository } from "../../infrastructure/repository";

const repository = new Repository();

export const validateCreateClientUserCommand = async (
  client: DynamoDBClient,
  body: any
): Promise<CreateClientUserValidationResponse> => {
  const response = await repository.getByEmail(body.email);

  if (response.Items && response.Items.length > 0) {
    return {
      result: false,
      message: "Email already exists",
    };
  }

  if (body.password.length < 8) {
    return {
      result: false,
      message: "Password must be at least 8 characters long",
    };
  }
  if (!body || !body.name || !body.surname || !body.email || !body.password) {
    return {
      result: false,
      message: "All fields are required",
    };
  }

  return {
    result: true,
  };
};
