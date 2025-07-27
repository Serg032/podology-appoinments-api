export class PasswordMinimumLengthError extends Error {
  constructor() {
    super("Password must be at least 8 characters long");
    this.name = "PasswordMinimumLengthError";
  }
}
