import { CreateCommand, UserDto } from ".";

export abstract class Repository {
  abstract save(command: CreateCommand): Promise<void>;
  abstract getById(id: string): Promise<UserDto | undefined>;
  abstract getByEmail(email: string): Promise<UserDto | undefined>;
}
