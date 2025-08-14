import * as jwt from "jsonwebtoken";

interface JwtGenerateTokenPayload {
  id: string;
  email: string;
  password: string;
}

export class JwtAdapter {
  private privateKeyValue: string;

  constructor(privateKey: string) {
    this.privateKeyValue = privateKey;
  }

  generateToken(payload: JwtGenerateTokenPayload) {
    return jwt.sign(payload, this.privateKeyValue);
  }
}
