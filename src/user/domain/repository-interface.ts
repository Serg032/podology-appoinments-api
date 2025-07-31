import { User } from ".";

export abstract class Repository {
  abstract save(user: User): Promise<User>;
  abstract getByEmail(email: string): Promise<User | undefined>;
}
