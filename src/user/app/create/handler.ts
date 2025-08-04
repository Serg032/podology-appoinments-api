import { Repository } from "../../domain/repository-interface";
import { CreateCommand } from "../../domain";

export class Handler {
  constructor(private repository: Repository) {}

  async handle(command: CreateCommand) {
    return await this.repository.save(command);
  }
}
