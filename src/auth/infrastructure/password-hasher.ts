import * as bcrypt from "bcryptjs";

export class PasswordHasher {
  async hash(password: string) {
    const salt = await bcrypt.genSalt(10);

    return bcrypt.hash(password, salt);
  }

  async compare(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
