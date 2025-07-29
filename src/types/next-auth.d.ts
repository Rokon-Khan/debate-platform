declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
      token?: string;
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

import { DefaultSession } from "next-auth";

// this process is know as module augmentation
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
