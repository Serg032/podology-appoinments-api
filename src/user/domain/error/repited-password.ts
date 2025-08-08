import { CustomError, ErrorCode } from "./index.interface";

export class RepitedPasswordError extends CustomError {
  code = ErrorCode.REPITEDPASSWORD_DONT_MATCH;
  statusCode: number;

  constructor() {
    super();
    this.statusCode = 400;
    this.message = "Repited password and pasword don't match";
    Object.setPrototypeOf(this, RepitedPasswordError.prototype);
  }
}
