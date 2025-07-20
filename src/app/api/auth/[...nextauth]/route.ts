/* eslint-disable @typescript-eslint/no-explicit-any */

import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { fetch as nextFetch } from "undici";

const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL;

// Helper for backend login using fetch (RTK Query uses fetch under the hood)
async function backendLogin(email: string, password: string) {
  const res = await nextFetch(`${backendBaseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

// Helper for backend Google login using fetch
async function backendGoogleLogin(profile: any) {
  // Save username (use Google given_name or fall back to name/email prefix)
  let username =
    profile.given_name ||
    (profile.name ? profile.name.split(" ")[0] : undefined) ||
    (profile.email ? profile.email.split("@")[0] : "user");

  // Remove non-alphanumeric from username (optional, matches backend model expectations)
  username = username.replace(/[^a-zA-Z0-9_]/g, "");

  const payload = {
    email: profile.email,
    username,
    name: profile.name,
    password: "google-auth", // Placeholder, backend should handle Google auth
    // googleId: profile.sub,
    // avatar: profile.picture,
  };
  const res = await nextFetch(`${backendBaseUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email or Username",
          type: "text",
          placeholder: "your@email.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const result = await backendLogin(
          credentials.email,
          credentials.password
        );
        if (result && result.user && result.token) {
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
      async profile(profile, tokens) {
        // Save username and email according to backend model
        const result = await backendGoogleLogin(profile);
        if (result && (result.user || result._id || result.id)) {
          const user = result.user || result;
          return {
            id: user.id || user._id,
            name: user.username || user.name || profile.name,
            email: user.email,
            image: user.avatar || profile.picture,
            provider: "google",
          };
        }
        // fallback: use Google profile if backend fails
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
    async jwt({ token, user, account, profile }) {
      if (user?.token) token.backendToken = user.token;
      if (user?.id) token.id = user.id;
      if (user?.provider) token.provider = user.provider;
      return token;
    },
    async session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      if (token.backendToken)
        session.backendToken = token.backendToken as string;
      if (token.provider) session.provider = token.provider as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
