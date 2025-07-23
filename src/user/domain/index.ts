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
  private readonly id: string;
  private readonly name: string;
  private readonly surname: string;
  private readonly email: string;
  private readonly password: string;
  private readonly type: UserType;

  constructor(
    id: string,
    name: string,
    surname: string,
    email: string,
    password: string,
    type: UserType
  ) {
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
}
