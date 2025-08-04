import { CreateCommand, UserDto } from "../domain";
import { User } from "../domain/entity";
import { Repository } from "../domain/repository-interface";

export class RepositoryInMemory implements Repository {
  users: User[] = [];

  constructor() {}

  async save(command: CreateCommand): Promise<void> {
    const user = new User(
      command.id,
      command.name,
      command.surname,
      command.email,
      command.password,
      command.type,
      command.repeatedPassword
    );

    this.users.push(user);
  }

  async getById(id: string): Promise<UserDto | undefined> {
    return this.users.find((user) => user.id === id)?.toUserDto();
  }

  async getByEmail(email: string): Promise<UserDto | undefined> {
    return this.users.find((user) => user.email === email)?.toUserDto();
  }
}
