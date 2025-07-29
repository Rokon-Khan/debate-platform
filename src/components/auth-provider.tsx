// "use client";

// import type React from "react";

// import useGoogleTokenSync from "@/app/hooks/use-google-token-sync";
// import { SessionProvider } from "next-auth/react";

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   useGoogleTokenSync();
//   return <SessionProvider>{children}</SessionProvider>;
// }

"use client";

import useGoogleTokenSync from "@/app/hooks/use-google-token-sync";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <TokenSyncWrapper />
      {children}
    </SessionProvider>
  );
}

function TokenSyncWrapper() {
  useGoogleTokenSync(); // now safely called within <SessionProvider>
  return null;
}
