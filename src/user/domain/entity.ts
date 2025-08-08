import { UserDto } from ".";

export enum UserType {
  admin = "ADMIN",
  client = "CLIENT",
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
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.password = password;
    this.type = type;
  }

  public toUserDto(): UserDto {
    return {
      id: this.id,
      name: this.name,
      surname: this.surname,
      email: this.email,
      password: this.password,
      type: this.type,
    };
  }
}
