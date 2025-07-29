/* eslint-disable @typescript-eslint/no-explicit-any */

// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// // import dbConnect, { collectionNames } from "@/lib/dbConnect";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       // The name to display on the sign in form (e.g. "Sign in with...")
//       name: "Credentials",
//       credentials: {
//         username: { label: "Username", type: "text", placeholder: "jsmith" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials, req) {
//         console.log("CREDENTIALS FROM AUTH", credentials);
//         // Add logic here to look up the user from the credentials supplied
//         if (!credentials) {
//           return null;
//         }
//         const { username, password } = credentials as Record<
//           "username" | "password",
//           string
//         >;
//         // const user = await dbConnect(collectionNames.TEST_USER).findOne({
//         //   username,
//         // });

//         // Mock user for demonstration; replace with actual user fetching logic
//         const user = {
//           id: "1",
//           name: "J Smith",
//           email: "jsmith@example.com",
//           username: "jsmith",
//           password: "password123",
//           role: "user",
//         };

//         const isPasswordOK = password == user.password;
//         //const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }

//         if (isPasswordOK) {
//           // Any object returned will be saved in `user` property of the JWT
//           return user;
//         } else {
//           // If you return null then an error will be displayed advising the user to check their details.
//           return null;

//           // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
//         }
//       },
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],
//   callbacks: {
//     async signIn({
//       user,
//       account,
//       profile,
//       email,
//       credentials,
//     }: {
//       user: import("next-auth").User;
//       account: any;
//       profile?: any;
//       email?: string;
//       credentials?: Record<string, unknown>;
//     }) {
//       if (account) {
//         try {
//           //console.log("FROM SIGNIN CALLBACK", { user, account, profile, email, credentials })
//           const { providerAccountId, provider } = account;
//           const { email: user_email, image, name } = user;
//           const payload = {
//             providerAccountId,
//             provider,
//             user_email,
//             image,
//             name,
//           };
//           console.log("FROM SIGNIN CALLBACK", payload);
//         } catch (error) {
//           console.log(error);
//           return false;
//         }
//       }

//       return true;
//     },
//     async session({
//       session,
//       token,
//     }: {
//       session: import("next-auth").Session;
//       token: any;
//     }) {
//       if (token) {
//         (session.user as any).username = token.username;
//         (session.user as any).role = token.role;
//       }
//       return session;
//     },
//     async jwt({
//       token,
//       user,
//       account,
//       profile,
//       isNewUser,
//     }: {
//       token: any;
//       user?: any;
//       account?: any;
//       profile?: any;
//       isNewUser?: boolean;
//     }) {
//       if (user) {
//         token.username = user.username;
//         token.role = user.role;
//       }
//       return token;
//     },
//   },
// };

// import type { NextAuthOptions } from "next-auth";

// import { AuthOptions } from "next-auth";

// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";

// export const authOptions: AuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         username: { label: "Username", type: "text", placeholder: "jsmith" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials) return null;

//         const { username, password } = credentials;

//         // Mock user (replace with your DB logic)
//         const user = {
//           id: "1",
//           name: "J Smith",
//           email: "jsmith@example.com",
//           username: "jsmith",
//           password: "password123",
//           role: "user",
//         };

//         if (password === user.password) {
//           return user;
//         } else {
//           return null;
//         }
//       },
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],

//   callbacks: {
//     async signIn({ user, account }) {
//       if (account) {
//         const payload = {
//           providerAccountId: account.providerAccountId,
//           provider: account.provider,
//           user_email: user.email ?? "unknown@example.com",
//           image: user.image ?? "",
//           name: user.name ?? "Unknown User",
//         };
//         console.log("FROM SIGNIN CALLBACK", payload);
//       }
//       return true;
//     },

//     async session({ session, token }) {
//       if (token) {
//         (session.user as any).username = token.username;
//         (session.user as any).role = token.role;
//       }
//       return session;
//     },

//     async jwt({ token, user }) {
//       if (user) {
//         token.username = (user as any).username;
//         token.role = (user as any).role;
//       }
//       return token;
//     },
//   },
// };

// NO js-cookie import here
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { fetch as nextFetch } from "undici";

const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL;

type BackendAuthResult = {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    // add other user fields if needed
  };
};

async function backendLogin(
  email: string,
  password: string
): Promise<BackendAuthResult | null> {
  const res = await nextFetch(`${backendBaseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json()) as BackendAuthResult;
}

async function backendGoogleLogin(
  profile: any
): Promise<BackendAuthResult | null> {
  let username =
    profile.given_name ||
    (profile.name ? profile.name.split(" ")[0] : undefined) ||
    (profile.email ? profile.email.split("@")[0] : "user");
  username = username.replace(/[^a-zA-Z0-9_]/g, "");

  const payload = {
    email: profile.email,
    username,
    name: profile.name,
    password: "google-auth",
  };

  let res = await nextFetch(`${backendBaseUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (res.ok) return (await res.json()) as BackendAuthResult;

  res = await nextFetch(`${backendBaseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: profile.email, password: "google-auth" }),
    cache: "no-store",
  });

  if (!res.ok) return null;
  return (await res.json()) as BackendAuthResult;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const result = await backendLogin(
          credentials.email,
          credentials.password
        );
        if (result && result.token && result.user) {
          return {
            id: result.user.id,
            name: result.user.username,
            email: result.user.email,
            token: result.token,
            provider: "credentials",
          };
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile) {
        const result = await backendGoogleLogin(profile);
        if (result && result.token && result.user) {
          return {
            id: result.user.id,
            name: result.user.username || profile.name,
            email: result.user.email,
            image: profile.picture,
            provider: "google",
            token: result.token,
          };
        }
        return {
          id: profile.sub,
          name:
            profile.given_name || profile.name || profile.email.split("@")[0],
          email: profile.email,
          image: profile.picture,
          provider: "google",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.token) token.backendToken = user.token;
      if (user?.id) token.id = user.id;
      if (user?.provider) token.provider = user.provider;
      if (user?.name) token.username = user.name;
      return token;
    },
    async session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      if (token.backendToken)
        session.backendToken = token.backendToken as string;
      if (token.provider) session.provider = token.provider as string;
      if (token.username) session.user.name = token.username as string;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
