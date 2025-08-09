import * as jwt from "jsonwebtoken";

interface JwtGenerateTokenPayload {
  id: string;
  email: string;
  password: string;
}

export class JwtAdapter {
  private privateKeyValue: string;

  constructor(value: string) {
    this.privateKeyValue = value;
  }

  generateToken(payload: JwtGenerateTokenPayload) {
    return jwt.sign(payload, this.privateKeyValue);
  }
}
