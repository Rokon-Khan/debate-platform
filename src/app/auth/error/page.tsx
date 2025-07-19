"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const errorMap: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You denied the request or your account is not allowed.",
  Verification: "The sign-in link is no longer valid or has already been used.",
  OAuthCallback:
    "OAuth provider rejected the request. Check redirect URI & credentials.",
};

export default function AuthErrorPage() {
  const params = useSearchParams();
  const error = params.get("error") ?? "Unknown";
  const message =
    errorMap[error] ??
    "An unknown error occurred. Check the server logs for details.";

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl">Authentication Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <p className="text-muted-foreground">{message}</p>
            <Button asChild>
              <Link href="/auth/signin">Try Again</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
