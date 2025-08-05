export class IdAlreadyRegistered extends Error {
  constructor(id: string) {
    super(`Id ${id} is already registered`);
  }
}
