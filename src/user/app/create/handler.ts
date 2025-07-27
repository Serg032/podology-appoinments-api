import { randomUUID } from "crypto";
import { CreateUserCommand, User } from "../../domain";
import { Repository } from "../../domain/repository-interface";

export const handler = async (
  repository: Repository,
  command: CreateUserCommand
): Promise<User> => {
  User.confirmPassword(command.password, command.repeatedPassword);

  const user = new User(
    randomUUID(),
    command.name,
    command.surname,
    command.email,
    command.password,
    command.type
  );

  return await repository.save(user);
};
