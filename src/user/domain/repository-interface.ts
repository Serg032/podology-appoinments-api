import { UserDto } from ".";
import { User } from "./entity";

export abstract class Repository {
  abstract save(user: User): Promise<void>;
  abstract getById(id: string): Promise<UserDto | undefined>;
  abstract getByEmail(email: string): Promise<UserDto | undefined>;
}
