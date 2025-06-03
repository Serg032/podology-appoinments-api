import { CreateClientUserValidationResponse } from "../../domain";
import { Repository } from "../../infrastructure/repository";

export const validateCreateClientUserCommand = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any
): Promise<CreateClientUserValidationResponse> => {
  const tableName = process.env.USER_TABLE_NAME;

  if (!tableName) {
    return {
      result: false,
      message: "USER_TABLE_NAME environment variable is not set",
    };
  }
  const repository = new Repository(tableName);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.email)) {
    return {
      result: false,
      message: "Invalid email format",
    };
  }
  const response = await repository.getByEmail(body.email);

  console.log("Validation response GET BY EMAIL", response);

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
