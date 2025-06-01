import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  CreateClientUserCommand,
  CreateClientUserValidationResponse,
  RegisterResponse,
  UserType,
} from "../../domain";
import { validateCreateClientUserCommand } from "./validate-create-client-user-command";
import { Repository } from "../../infrastructure/repository";

const repository = new Repository();

export const handler = async (
  body: CreateClientUserCommand
): Promise<RegisterResponse | CreateClientUserValidationResponse> => {
  const dbClient = new DynamoDBClient();

  const validationResponse = await validateCreateClientUserCommand(
    dbClient,
    body
  );

  if (validationResponse.result === false) {
    return validationResponse as CreateClientUserValidationResponse;
  }

  const createdClient = await repository.createClient(body);

  console.log("CREATED CLIENT", createdClient);

  if (!createdClient || !createdClient.Attributes) {
    return {
      result: false,
      message: "Error creating user",
    };
  }

  return {
    id: createdClient.Attributes.id.S!,
    name: createdClient.Attributes.name.S!,
    surname: createdClient.Attributes.surname.S!,
    email: createdClient.Attributes.email.S!,
    password: createdClient.Attributes.password.S!,
    type: UserType.client,
    token: "", // TODO: generate token
  };
};
