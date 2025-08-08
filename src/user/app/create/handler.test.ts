import { randomUUID } from "crypto";
import { CreateCommand } from "../../domain";
import { RepositoryInMemory } from "../../infrastructure/repository-in-memory";
import { UserType } from "../../domain/entity";
import { Handler } from "../create/handler";
import { Handler as GetByIdHandler } from "../get-by-id/handler";
import { RepitedPasswordError } from "../../domain/error/repited-password";
import { PasswordMinimumLengthError } from "../../domain/error/password-minimun-length";
import { IdAlreadyRegistered } from "../../domain/error/id-already-registered";
import { EmailNotWellFormed } from "../../domain/error/email-not-well-formed";
import { EmailAlreadyRegistered } from "../../domain/error/email-already-registered";

describe("When creating a user", () => {
  const repository = new RepositoryInMemory();
  const handler = new Handler(repository);
  const getByIdHandler = new GetByIdHandler(repository);
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
    await handler.handle(createCommand);
  });

  it("should be created", async () => {
    const createdUser = await getByIdHandler.handle(id);
    expect(createdUser).toBeDefined();
    expect(createdUser?.id).toStrictEqual(id);
  });

  describe("and there's an existing user with the same id", () => {
    const createCommand: CreateCommand = {
      id,
      name: "John2",
      surname: "Doe2",
      email: "johndoe@test12.com",
      password: "12345678",
      type: UserType.client,
      repeatedPassword: "12345678",
    };

    it("shuoldn't be created", async () => {
      await expect(handler.handle(createCommand)).rejects.toThrow(
        new IdAlreadyRegistered(createCommand.id)
      );
    });
  });

  describe("and the password and repeated password does't match", () => {
    const invalidCommand: CreateCommand = {
      id: "629d6434-db27-4aec-87ea-f849b6f383ca",
      name: "John",
      surname: "Doe",
      email: "johndoe@test2.com",
      password: "12345678",
      type: UserType.client,
      repeatedPassword: "12345679",
    };
    it("should throw an specific error", async () => {
      await expect(handler.handle(invalidCommand)).rejects.toThrow(
        new RepitedPasswordError()
      );
    });
  });

  describe("and the password has not the minimun lenght", () => {
    const invalidCommand: CreateCommand = {
      id: "4a2b1dc6-b128-4b4a-9248-e5acc2771e09",
      name: "John",
      surname: "Doe",
      email: "johndoe@test2.com",
      password: "1234567",
      type: UserType.client,
      repeatedPassword: "1234567",
    };
    it("should throw an specific error", async () => {
      await expect(handler.handle(invalidCommand)).rejects.toThrow(
        new PasswordMinimumLengthError()
      );
    });
  });

  describe("and there is a user with the same email already at the sistem", () => {
    it("should throw a specific error", async () => {
      const createCommand: CreateCommand = {
        id: "388bab68-f7de-462e-aa4a-d4d7cd6dbd9c",
        name: "John",
        surname: "Doe",
        email: "johndoe@test.com",
        password: "12345678",
        type: UserType.client,
        repeatedPassword: "12345678",
      };

      await expect(handler.handle(createCommand)).rejects.toThrow(
        new EmailAlreadyRegistered(createCommand.email)
      );
    });
  });

  describe("and the email address is not well formed", () => {
    it("should throw a specific error", async () => {
      const createCommand: CreateCommand = {
        id: "388bab68-f7de-462e-aa4a-d4d7cd6dbd9c",
        name: "John",
        surname: "Doe",
        email: "johndoesafasdasdasd",
        password: "12345678",
        type: UserType.client,
        repeatedPassword: "12345678",
      };

      await expect(handler.handle(createCommand)).rejects.toThrow(
        new EmailNotWellFormed(createCommand.email)
      );
    });
  });
});
