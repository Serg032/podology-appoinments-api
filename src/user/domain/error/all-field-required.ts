import { CustomError, ErrorCode } from "./index.interface";

export class AllFieldsRequired extends CustomError {
  code = ErrorCode.ALL_FIELDS_REQUIRED;
  statusCode: number;

  constructor() {
    super();
    this.statusCode = 400;
    this.message = `All fields are required`;
    Object.setPrototypeOf(this, AllFieldsRequired.prototype);
  }
}
