import { CustomError, ErrorCode } from "./index.interface";

export class MoreThanOneUserWithSameEmail extends CustomError {
  code = ErrorCode.MORE_THAN_ONE_USER_WITH_SAME_EMAIL;
  statusCode: number;

  constructor(email: string) {
    super(email);
    this.statusCode = 409;
    this.message = `There are more than one user with the same email: ${email}`;
    Object.setPrototypeOf(this, MoreThanOneUserWithSameEmail);
  }
}
