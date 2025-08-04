import { randomUUID } from "crypto";
import { CreateCommand } from "../../domain";
import { RepositoryInMemory } from "../../infrastructure/repository-in-memory";
import { UserType } from "../../domain/entity";
import { Handler } from "../create/handler";
import { Handler as GetByIdHandler } from "../get-by-id/handler";
import { RepitedPasswordError } from "../../domain/error/repited-password";
import { PasswordMinimumLengthError } from "../../domain/error/password-minimun-length";

describe("When creating a user", () => {
  const repository = new RepositoryInMemory();
  const createHandler = new Handler(repository);
  const getByIdHandler = new GetByIdHandler(repository);
  const id = randomUUID();

  const userDto: CreateCommand = {
    id,
    name: "John",
    surname: "Doe",
    email: "johndoe@test.com",
    password: "12345678",
    type: UserType.client,
    repeatedPassword: "12345678",
  };

  beforeAll(async () => {
    await createHandler.handle(userDto);
  });

  it("should be created", async () => {
    const createdUser = await getByIdHandler.handle(id);
    expect(createdUser).toBeDefined();
    expect(createdUser?.id).toStrictEqual(id);
  });

  describe("and the password and repeated password does't match", () => {
    const invalidCommand: CreateCommand = {
      id,
      name: "John",
      surname: "Doe",
      email: "johndoe@test.com",
      password: "12345678",
      type: UserType.client,
      repeatedPassword: "12345679",
    };
    it("should throw an specific error", async () => {
      await expect(createHandler.handle(invalidCommand)).rejects.toThrow(
        RepitedPasswordError
      );
    });
  });

  describe("and the password has not the minimun lenght", () => {
    const invalidCommand: CreateCommand = {
      id,
      name: "John",
      surname: "Doe",
      email: "johndoe@test.com",
      password: "1234567",
      type: UserType.client,
      repeatedPassword: "1234567",
    };
    it("should throw an specific error", async () => {
      await expect(createHandler.handle(invalidCommand)).rejects.toThrow(
        PasswordMinimumLengthError
      );
    });
  });
});
