"use client";

import Cookies from "js-cookie";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function useGoogleTokenSync() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.backendToken) {
      Cookies.set("auth_token", session.backendToken, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
    }
  }, [session]);
}
