declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
    };
    backendToken?: string;
    provider?: string;
  }
  interface User {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    token?: string;
    provider?: string;
  }
}
