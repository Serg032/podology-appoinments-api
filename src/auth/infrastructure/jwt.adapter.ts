import * as jwt from "jsonwebtoken";

interface JwtGenerateTokenPayload {
  id: string;
  name: string;
  surname: string;
  email: string;
}

interface JwtRefreshPayload {
  sub: string;
  type: "refresh";
}

export class JwtAdapter {
  private privateKeyValue: string;

  constructor(privateKey: string) {
    this.privateKeyValue = privateKey;
  }

  generateAccessToken(payload: JwtGenerateTokenPayload) {
    return jwt.sign(payload, this.privateKeyValue, {
      expiresIn: "15m",
      issuer: "my-app",
    });
  }

  generateRefreshToken(payload: JwtRefreshPayload) {
    return jwt.sign(payload, this.privateKeyValue, {
      expiresIn: "7d", // duración larga
      issuer: "my-app",
    });
  }
}
