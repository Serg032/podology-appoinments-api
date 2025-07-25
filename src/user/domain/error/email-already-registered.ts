export class EmailAlreadyRegistered extends Error {
  constructor(email: string) {
    super(`Email ${email} is already registered`);
  }
}
