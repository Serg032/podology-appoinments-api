import { Repository } from "../../domain/repository-interface";
import { CreateCommand } from "../../domain";
import { EmailAlreadyRegistered } from "../../domain/error/email-already-registered";
import { IdAlreadyRegistered } from "../../domain/error/id-already-registered";
import { ErrorData } from "../../domain/error/index.interface";
import { EmailNotWellFormed } from "../../domain/error/email-not-well-formed";
import { User } from "../../domain/entity";

export class Handler {
  constructor(private repository: Repository) {}

  async handle(command: CreateCommand): Promise<void | ErrorData> {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!EMAIL_REGEX.test(command.email))
      throw new EmailNotWellFormed(command.email);

    const userById = await this.repository.getById(command.id);

    if (userById) throw new IdAlreadyRegistered(command.id);

    const userByEmail = await this.repository.getByEmail(command.email);

    if (userByEmail) throw new EmailAlreadyRegistered(command.email);

    await this.repository.save(
      new User(
        command.id,
        command.name,
        command.surname,
        command.email,
        command.password,
        command.type
      )
    );
  }
}
