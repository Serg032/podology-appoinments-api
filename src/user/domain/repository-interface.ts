import { CreateUserCommand, User } from ".";

export abstract class Repository {
  abstract save(command: CreateUserCommand): Promise<void>;
  abstract getByEmail(email: string): Promise<User | undefined>;
}
