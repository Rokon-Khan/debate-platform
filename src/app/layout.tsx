import { AuthProvider } from "@/components/auth-provider";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ReduxProvider } from "@/redux/Provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Community Debate Arena - Battle of Opinions",
  description:
    "A platform where users can create and join debates, post arguments, and vote on the most compelling responses.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="debate-arena-theme"
        >
          <AuthProvider>
            <ReduxProvider>
              <div className="min-h-screen bg-background text-foreground">
                <Navigation />
                <main>{children}</main>
              </div>
              <Footer />
            </ReduxProvider>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
