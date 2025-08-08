import { CustomError, ErrorCode } from "./index.interface";

export class EmailNotWellFormed extends CustomError {
  code = ErrorCode.EMAIL_NOT_WELL_FORMED;
  statusCode: number;

  constructor(email: string) {
    super(email);
    this.statusCode = 409;
    this.message = `Email ${email} not well formed`;
    Object.setPrototypeOf(this, EmailNotWellFormed.prototype);
  }
}
