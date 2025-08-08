import { CustomError, ErrorCode } from "./index.interface";

export class PasswordMinimumLengthError extends CustomError {
  code = ErrorCode.PASSWORD_MINIMUM_LENGTH;
  statusCode: number;

  constructor() {
    super();
    this.statusCode = 400;
    this.message = "Password needs to be 8 length";
    Object.setPrototypeOf(this, PasswordMinimumLengthError);
  }
}
