import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Handler } from "../../user/app/create/handler";
import { DynamoDbRepository } from "../../user/infrastructure/repository";
import { CreateCommand } from "../../user/domain";
import { CustomError } from "../../user/domain/error/index.interface";
import { AllFieldsRequired } from "../../user/domain/error/all-field-required";
import { PasswordHasher } from "../../auth/infrastructure/password-hasher";
import { JwtAdapter } from "../../auth/infrastructure/jwt.adapter";
import { ParameterStoreService } from "../../auth/infrastructure/parameter-store.service";
import { PasswordMinimumLengthError } from "../../user/domain/error/password-minimun-length";
import { RepitedPasswordError } from "../../user/domain/error/repited-password";

interface SuccessfullRegisterResponse {
  message: string;
  token: string;
}

const tableName = process.env.USER_TABLE_NAME;

if (!tableName) {
  throw new Error("USER_TABLE_NAME env variable is not set");
}

const repository = new DynamoDbRepository(tableName);
const passwordHaser = new PasswordHasher();
const createHandler = new Handler(repository);

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const jwtSecretParameterName = process.env.JWT_SECRET_PARAMETER_NAME;

    if (!jwtSecretParameterName) {
      throw new Error("JWT_SECRET_PARAMETER_NAME env variable is not set");
    }

    const parameterStoreService = new ParameterStoreService();
    const jwtPrivateKey = await parameterStoreService.getParameterValue(
      jwtSecretParameterName
    );
    const jwtAdapter = new JwtAdapter(jwtPrivateKey);
    const body = event.body;

    if (!body) {
      throw new Error("There's no body");
    }

    const parsedBody = JSON.parse(body) as CreateCommand;

    validateCreateCommand(parsedBody);

    if (parsedBody.password.length < 8) throw new PasswordMinimumLengthError();

    if (parsedBody.password !== parsedBody.repeatedPassword)
      throw new RepitedPasswordError();

    console.log("EVENT BODY: ", parsedBody);

    const hashedPassword = await passwordHaser.hash(parsedBody.password);

    await createHandler.handle({
      ...parsedBody,
      password: hashedPassword,
    });

    const token = jwtAdapter.generateToken({
      id: parsedBody.id,
      email: parsedBody.email,
      password: parsedBody.password,
    });

    const response: SuccessfullRegisterResponse = {
      message: "User Created",
      token,
    };

    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error("error", error);
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
