import { PasswordMinimumLengthError } from "./error/password-minimun-length";
import { RepitedPasswordError } from "./error/repited-password";

export enum UserType {
  admin = "ADMIN",
  client = "CLIENT",
}

export interface CreateUserCommand {
  name: string;
  surname: string;
  email: string;
  password: string;
  repeatedPassword: string;
  type: UserType;
}

export interface CreateClientUserValidationResponse {
  result: boolean;
  message?: string;
}

export interface RegisterResponse extends User {
  token: string;
}

export class User {
  public readonly id: string;
  public readonly name: string;
  public readonly surname: string;
  public readonly email: string;
  public readonly password: string;
  public readonly type: UserType;

  constructor(
    id: string,
    name: string,
    surname: string,
    email: string,
    password: string,
    type: UserType
  ) {
    this.ensurePasswordMinimumLength(password);

    this.id = id;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.password = password;
    this.type = type;
  }

  static confirmPassword(password: string, repitedPassword: string) {
    if (password !== repitedPassword) {
      throw new RepitedPasswordError();
    }
  }

  private ensurePasswordMinimumLength(password: string) {
    if (password.length < 8) {
      throw new PasswordMinimumLengthError();
    }
  }
}
