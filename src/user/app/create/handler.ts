import { Repository } from "../../domain/repository-interface";
import { CreateCommand } from "../../domain";
import { EmailAlreadyRegistered } from "../../domain/error/email-already-registered";
import { IdAlreadyRegistered } from "../../domain/error/id-already-registered";
import { ErrorData } from "../../domain/error/index.interface";

export class Handler {
  constructor(private repository: Repository) {}

  async handle(command: CreateCommand): Promise<void | ErrorData> {
    const userById = await this.repository.getById(command.id);

    if (userById) {
      throw new IdAlreadyRegistered(command.id);
    }
    const userByEmail = await this.repository.getByEmail(command.email);

    if (userByEmail) {
      throw new EmailAlreadyRegistered(command.email);
    }

    return await this.repository.save(command);
  }
}
