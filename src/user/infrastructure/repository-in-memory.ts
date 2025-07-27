import { User } from "../domain";
import { Repository } from "../domain/repository-interface";

export class RepositoryInMemory implements Repository {
  users: User[];
  constructor() {
    this.users = [];
  }
  async save(user: User): Promise<User> {
    this.users.push(user);

    return user;
  }

  getByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }
}
