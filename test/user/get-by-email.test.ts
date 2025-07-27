import { CreateUserCommand, User, UserType } from "../../src/user/domain";
import { handler as create } from "../../src/user/app/create/handler";
import { RepositoryInMemory } from "../../src/user/infrastructure/repository-in-memory";
import { handler } from "../../src/user/app/get-by-id/handler";

const repository = new RepositoryInMemory();

describe("When getting a user by email", () => {
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

  it("should retrieve the user", () => {
    const user = handler(repository, createCommand.email);

    expect(createdUser).toStrictEqual(user);
  });

  describe("and the email doesn't match the query", () => {
    it("should return undefined", () => {
      const undefinedUser = handler(repository, "not exists");

      expect(undefinedUser).toBeUndefined();
    });
  });
});
