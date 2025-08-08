export enum ErrorCode {
  EMAIL_ALREADY_REGISTERED = "EMAIL_ALREADY_REGISTERED",
  ID_ALREADY_EXISTS = "ID_ALREADY_EXISTS",
  PASSWORD_MINIMUM_LENGTH = "PASSWORD_MINIMUM_LENGTH",
  REPITEDPASSWORD_DONT_MATCH = "REPITEDPASSWORD_DONT_MATCH",
  MORE_THAN_ONE_USER_WITH_SAME_EMAIL = "MORE_THAN_ONE_USER_WITH_SAME_EMAIL",
  ALL_FIELDS_REQUIRED = "ALL_FIELDS_REQUIRED",
  EMAIL_NOT_WELL_FORMED = "EMAIL_NOT_WELL_FORMED",
}

export interface ErrorData {
  code: ErrorCode;
  message: string;
}

export abstract class CustomError extends Error {
  abstract readonly code: ErrorCode;
  abstract readonly statusCode: number;

  constructor(value?: string) {
    super(value);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
  toJson(): ErrorData {
    return {
      code: this.code,
      message: this.message,
    };
  }
}
