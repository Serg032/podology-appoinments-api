import { randomUUID } from "crypto";
import { CreateCommand } from "../../domain";
import { RepositoryInMemory } from "../../infrastructure/repository-in-memory";
import { UserType } from "../../domain/entity";
import { Handler as CreateHandler } from "../create/handler";
import { Handler } from "./handler";

describe("When getting a user by email", () => {
  const repository = new RepositoryInMemory();
  const createHandler = new CreateHandler(repository);
  const handler = new Handler(repository);
  const email = "johndoe@test.com";

  const command: CreateCommand = {
    id: randomUUID(),
    name: "John",
    surname: "Doe",
    email,
    password: "12345678",
    type: UserType.client,
    repeatedPassword: "12345678",
  };

  beforeAll(async () => {
    await createHandler.handle(command);
  });
  it("should be retrieved", async () => {
    const user = await handler.handle(email);
    expect(user).toBeDefined();
    expect(user?.email).toBe(email);
  });

  describe("and the user with the email doesn't exist", () => {
    it("should return undefined", async () => {
      const user = await handler.handle("email");
      expect(user).toBeUndefined();
    });
  });
});
