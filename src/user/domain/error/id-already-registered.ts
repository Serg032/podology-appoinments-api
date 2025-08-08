import { CustomError, ErrorCode } from "./index.interface";

export class IdAlreadyRegistered extends CustomError {
  code = ErrorCode.ID_ALREADY_EXISTS;
  statusCode: number;

  constructor(id: string) {
    super(id);
    this.statusCode = 409;
    this.message = `Id ${id} already registered`;
    Object.setPrototypeOf(this, IdAlreadyRegistered);
  }
}
