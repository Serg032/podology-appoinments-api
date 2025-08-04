import { UserType } from "./entity";

export interface UserDto {
  id: string;
  name: string;
  surname: string;
  email: string;
  type: UserType;
  password: string;
}

export interface CreateCommand {
  id: string;
  name: string;
  surname: string;
  email: string;
  type: UserType;
  password: string;
  repeatedPassword: string;
}
