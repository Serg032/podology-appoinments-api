import { randomUUID } from "crypto";
import { CreateCommand } from "../../domain";
import { RepositoryInMemory } from "../../infrastructure/repository-in-memory";
import { Handler as CreateHandler } from "../create/handler";
import { UserType } from "../../domain/entity";
import { Handler } from "./handler";

describe("When getting a user by id", () => {
  const repository = new RepositoryInMemory();
  const createHandler = new CreateHandler(repository);
  const handler = new Handler(repository);
  const id = randomUUID();
  const createCommand: CreateCommand = {
    id,
    name: "John",
    surname: "Doe",
    email: "johndoe@test.com",
    password: "12345678",
    type: UserType.client,
    repeatedPassword: "12345678",
  };

  beforeAll(async () => {
    await createHandler.handle(createCommand);
  });

  it("should be retrieved", async () => {
    const createdUser = await handler.handle(id);
    expect(createdUser).toBeDefined();
    expect(createdUser?.id).toBe(id);
  });

  describe("and the user with that id doesn't exist", () => {
    it("should return undefined", async () => {
      const undefinedUser = await handler.handle("randomUUID");
      expect(undefinedUser).toBeUndefined();
    });
  });
});
