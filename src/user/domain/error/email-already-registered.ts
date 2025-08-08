import { CustomError, ErrorCode } from "./index.interface";

export class EmailAlreadyRegistered extends CustomError {
  code = ErrorCode.EMAIL_ALREADY_REGISTERED;
  statusCode: number;

  constructor(email: string) {
    super(email);
    this.statusCode = 409;
    this.message = `Email ${email} already registered`;
    Object.setPrototypeOf(this, EmailAlreadyRegistered.prototype);
  }
}
