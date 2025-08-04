import { Repository } from "../../domain/repository-interface";

export class Handler {
  constructor(private repository: Repository) {}

  async handle(id: string) {
    return await this.repository.getById(id);
  }
}
