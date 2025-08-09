import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Handler } from "../../user/app/create/handler";
import { DynamoDbRepository } from "../../user/infrastructure/repository";
import { CreateCommand } from "../../user/domain";
import { CustomError } from "../../user/domain/error/index.interface";
import { AllFieldsRequired } from "../../user/domain/error/all-field-required";
import { PasswordHasher } from "../../auth/infrastructure/password-hasher";
import { JwtAdapter } from "../../auth/infrastructure/jwt.adapter";
import * as ssm from "aws-cdk-lib/aws-ssm";

const tableName = process.env.USER_TABLE_NAME;
const jwtPrivateKeyParameterName = ssm.StringParameter.fromStringParameterName(
  process.env.JWT_SECRET_PARAMETER_NAME
);

if (!tableName) {
  throw new Error("USER_TABLE_NAME env variable is not set");
}

const repository = new DynamoDbRepository(tableName);
const passwordHaser = new PasswordHasher();
const createHandler = new Handler(repository);
const jwtAdapter = new JwtAdapter();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = event.body;

    if (!body) {
      throw new Error("There's no body");
    }

    const parsedBody = JSON.parse(body) as CreateCommand;

    validateCreateCommand(parsedBody);

    console.log("EVENT BODY: ", parsedBody);

    const hashedPassword = await passwordHaser.hash(parsedBody.password);

    const handlerResponse = await createHandler.handle({
      ...parsedBody,
      password: hashedPassword,
    });

    const token = console.log("Handler Response", handlerResponse);

    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "User created" }),
    };
  } catch (error) {
    if (error instanceof CustomError) {
      return {
        statusCode: error.statusCode,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify((error as CustomError).toJson()),
      };
    }

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }

  function validateCreateCommand(command: Partial<CreateCommand>) {
    if (
      !command.id ||
      !command.name ||
      !command.surname ||
      !command.email ||
      !command.password ||
      !command.repeatedPassword ||
      !command.type
    ) {
      throw new AllFieldsRequired();
    }
  }
};
