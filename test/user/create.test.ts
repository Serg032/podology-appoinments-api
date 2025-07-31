import { CreateUserCommand, User, UserType } from "../../src/user/domain";
import { RepositoryInMemory } from "../../src/user/infrastructure/repository-in-memory";
import { handler as create } from "../../src/user/app/create/handler";
import { RepitedPasswordError } from "../../src/user/domain/error/repited-password";
import { PasswordMinimumLengthError } from "../../src/user/domain/error/password-minimun-length";

const repository = new RepositoryInMemory();

describe("When creating a user", () => {
  const createCommand: CreateUserCommand = {
    name: "John",
    surname: "Doe",
    email: "johndoe@test.com",
    password: "12345678",
    repeatedPassword: "12345678",
    type: UserType.client,
  };

  let createdUser: User;

  beforeAll(async () => {
    createdUser = await create(repository, createCommand);
  });

  it("should be created", () => {
    const userAtRepository = repository.users.find(
      (user) => user.email === createCommand.email
    );
    expect(userAtRepository).toStrictEqual(createdUser);
  });

  describe("and password and repeatedPassword is not the same", () => {
    const notSamePasswordCreateCommand: CreateUserCommand = {
      name: "Alana",
      surname: "La Rana",
      email: "alanalara@test.com",
      password: "12345678",
      repeatedPassword: "22345678",
      type: UserType.client,
    };

    it("should throw an error", async () => {
      await expect(
        create(repository, notSamePasswordCreateCommand)
      ).rejects.toThrow(RepitedPasswordError);
    });
  });

  describe("and password is not long enough", () => {
    const notEnoughPasswordCreateCommand: CreateUserCommand = {
      name: "Alana",
      surname: "La Rana",
      email: "alanalarana@test.com",
      password: "1234567",
      repeatedPassword: "1234567",
      type: UserType.client,
    };

    it("should throw an error", async () => {
      await expect(
        create(repository, notEnoughPasswordCreateCommand)
      ).rejects.toThrow(PasswordMinimumLengthError);
    });
  });

  describe("and there is a user with the same email registered", () => {
    const createAlreadyRegisteredUser: CreateUserCommand = {
      name: "John",
      surname: "Doe",
      email: "johndoe@test.com",
      password: "12345678",
      repeatedPassword: "12345678",
      type: UserType.client,
    };

    beforeEach(async () => {
      await create(repository, createAlreadyRegisteredUser);
    });

    it("should throw an error", () => {});
  });
});
