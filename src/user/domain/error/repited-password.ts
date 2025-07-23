export class RepitedPasswordError implements Error {
  name: string;
  message: string;
  constructor() {
    this.name = "Repited Password Error";
    this.message = "Repited password does`t match password";
  }
}
