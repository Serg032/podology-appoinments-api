interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  type: UserType;
}

enum UserType {
  admin = "ADMIN",
  client = "CLIENT",
}
