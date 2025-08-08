import { UserDto } from "../domain";
import { User } from "../domain/entity";
import { Repository } from "../domain/repository-interface";

export class RepositoryInMemory implements Repository {
  users: User[] = [];

  constructor() {}

  async save(user: User): Promise<void> {
    this.users.push(
      new User(
        user.id,
        user.name,
        user.surname,
        user.email,
        user.password,
        user.type
      )
    );
  }

  async getById(id: string): Promise<UserDto | undefined> {
    return this.users.find((user) => user.id === id)?.toUserDto();
  }

  async getByEmail(email: string): Promise<UserDto | undefined> {
    return this.users.find((user) => user.email === email)?.toUserDto();
  }
}
