import { randomUUID } from "crypto";
import { CreateUserCommand, User } from "../../domain";
import { Repository } from "../../domain/repository-interface";

export const handler = async (
  repository: Repository,
  command: CreateUserCommand
): Promise<User> => {
  const existedUser = await repository.getByEmail(command.email);

  User.confirmPassword(command.password, command.repeatedPassword);

  return new User(
    randomUUID(),
    command.name,
    command.surname,
    command.email,
    command.password,
    command.type
  );
};
