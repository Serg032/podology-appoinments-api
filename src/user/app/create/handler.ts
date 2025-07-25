import { randomUUID } from "crypto";
import { CreateUserCommand, User } from "../../domain";
import { Repository } from "../../domain/repository-interface";

export const handler = async (
  repository: Repository,
  command: CreateUserCommand
): Promise<User> => {
  await repository.getByEmail(command.email);

  User.confirmPassword(command.password, command.repeatedPassword);

  const createUser = await repository.save({
    name: command.name,
    surname: command.surname,
    email: command.email,
    password: command.password,
    repeatedPassword: command.repeatedPassword,
    type: command.type,
  });

  return new User(
    randomUUID(),
    command.name,
    command.surname,
    command.email,
    command.password,
    command.type
  );
};
