interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  type: UserType;
}

export enum UserType {
  admin = "ADMIN",
  client = "CLIENT",
}

export interface CreateClientUserCommand {
  name: string;
  surname: string;
  email: string;
  password: string;
}

export interface CreateClientUserValidationResponse {
  result: boolean;
  message?: string;
}

export interface RegisterResponse extends User {
  token: string;
}
