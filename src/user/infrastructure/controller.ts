import { handler } from "../app/create/handler";
import { CreateUserCommand } from "../domain";

const createUserHandler = handler;

export class Controller {
  save(input: CreateUserCommand) {
    createUserHandler(input);
  }
}
