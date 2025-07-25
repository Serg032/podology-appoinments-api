export class RepitedPasswordError extends Error {
  constructor() {
    super("Repited password does`t match password");
  }
}
