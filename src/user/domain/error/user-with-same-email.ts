export class MoreThanOneUserWithSameEmail extends Error {
  constructor(email: string) {
    super(
      `More than one user with same email: ${email}. Contact with the administration`
    );
  }
}
