// "use client";

// import { ModeToggle } from "@/components/mode-toggle";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { motion } from "framer-motion";
// import { LogOut, Menu, Plus, Trophy, User, X } from "lucide-react";
// import { signOut, useSession } from "next-auth/react";
// import Link from "next/link";
// import { useState } from "react";

// export function Navigation() {
//   const { data: session, status } = useSession();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   return (
//     <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
//       <div className="container mx-auto px-4">
//         <div className="flex h-16 items-center justify-between">
//           {/* Logo */}
//           <Link href="/" className="flex items-center space-x-2">
//             <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-sm">DA</span>
//             </div>
//             <span className="font-bold text-xl hidden sm:inline">
//               Debate Arena
//             </span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-6">
//             <Link
//               href="/"
//               className="text-foreground/80 hover:text-foreground transition-colors"
//             >
//               Debates
//             </Link>
//             <Link
//               href="/scoreboard"
//               className="text-foreground/80 hover:text-foreground transition-colors flex items-center gap-1"
//             >
//               <Trophy className="h-4 w-4" />
//               Scoreboard
//             </Link>
//             {session && (
//               <Link href="/create-debate">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="gap-1 bg-transparent"
//                 >
//                   <Plus className="h-4 w-4" />
//                   Create Debate
//                 </Button>
//               </Link>
//             )}
//           </div>

//           {/* Right side */}
//           <div className="flex items-center space-x-4">
//             <ModeToggle />

//             {status === "loading" ? (
//               <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
//             ) : session ? (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     className="relative h-8 w-8 rounded-full"
//                   >
//                     <Avatar className="h-8 w-8">
//                       <AvatarImage
//                         src={session.user?.image || ""}
//                         alt={session.user?.name || ""}
//                       />
//                       <AvatarFallback>
//                         {session.user?.name?.charAt(0).toUpperCase() || "U"}
//                       </AvatarFallback>
//                     </Avatar>
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent className="w-56" align="end" forceMount>
//                   <div className="flex items-center justify-start gap-2 p-2">
//                     <div className="flex flex-col space-y-1 leading-none">
//                       {session.user?.name && (
//                         <p className="font-medium">{session.user.name}</p>
//                       )}
//                       {session.user?.email && (
//                         <p className="w-[200px] truncate text-sm text-muted-foreground">
//                           {session.user.email}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem asChild>
//                     <Link href="/profile" className="flex items-center gap-2">
//                       <User className="h-4 w-4" />
//                       Profile
//                     </Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem asChild>
//                     <Link
//                       href="/scoreboard"
//                       className="flex items-center gap-2"
//                     >
//                       <Trophy className="h-4 w-4" />
//                       Scoreboard
//                     </Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem
//                     className="flex items-center gap-2 text-red-600"
//                     onClick={() => signOut()}
//                   >
//                     <LogOut className="h-4 w-4" />
//                     Sign out
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             ) : (
//               //   <Button onClick={() => signIn("google")} size="sm">
//               //     Sign In
//               //   </Button>
//               <Link href="/auth/signin">
//                 <Button size="sm" variant="outline">
//                   Sign In
//                 </Button>
//               </Link>
//             )}

//             {/* Mobile menu button */}
//             <Button
//               variant="ghost"
//               size="sm"
//               className="md:hidden"
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             >
//               {mobileMenuOpen ? (
//                 <X className="h-5 w-5" />
//               ) : (
//                 <Menu className="h-5 w-5" />
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {mobileMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             className="md:hidden border-t py-4"
//           >
//             <div className="flex flex-col space-y-3">
//               <Link
//                 href="/"
//                 className="text-foreground/80 hover:text-foreground transition-colors px-2 py-1"
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 Debates
//               </Link>
//               <Link
//                 href="/scoreboard"
//                 className="text-foreground/80 hover:text-foreground transition-colors px-2 py-1 flex items-center gap-2"
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 <Trophy className="h-4 w-4" />
//                 Scoreboard
//               </Link>
//               {session && (
//                 <Link
//                   href="/create-debate"
//                   className="text-foreground/80 hover:text-foreground transition-colors px-2 py-1 flex items-center gap-2"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   <Plus className="h-4 w-4" />
//                   Create Debate
//                 </Link>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </nav>
//   );
// }

"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { LogOut, Menu, Plus, Trophy, User, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Navigation() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<{
    name?: string;
    email?: string;
    image?: string;
  } | null>(null);

  useEffect(() => {
    // Check for NextAuth session or auth_token cookie
    const token = Cookies.get("auth_token");
    if (session) {
      setIsAuthenticated(true);
      setUserData({
        name: session.user?.name || "",
        email: session.user?.email || "",
        image: session.user?.image || "",
      });
    } else if (token) {
      try {
        // Decode JWT to extract user data (assuming JWT structure)
        const payload = JSON.parse(atob(token.split(".")[1]));
        setIsAuthenticated(true);
        setUserData({
          name: payload.username || "",
          email: payload.email || "",
          image: "", // No image in manual login
        });
      } catch (error) {
        console.error("Failed to decode token:", error);
        setIsAuthenticated(false);
        setUserData(null);
      }
    } else {
      setIsAuthenticated(false);
      setUserData(null);
    }
  }, [session, status]);

  const handleSignOut = async () => {
    // Remove auth_token cookie
    Cookies.remove("auth_token", { path: "/" });
    // Sign out from NextAuth
    await signOut({ callbackUrl: "/auth/signin" });
    setMobileMenuOpen(false);
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DA</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline">
              Debate Arena
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Debates
            </Link>
            <Link
              href="/scoreboard"
              className="text-foreground/80 hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Trophy className="h-4 w-4" />
              Scoreboard
            </Link>
            {isAuthenticated && (
              <Link href="/create-debate">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 bg-transparent"
                >
                  <Plus className="h-4 w-4" />
                  Create Debate
                </Button>
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <ModeToggle />

            {status === "loading" ? (
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={userData?.image || ""}
                        alt={userData?.name || ""}
                      />
                      <AvatarFallback>
                        {userData?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {userData?.name && (
                        <p className="font-medium">{userData.name}</p>
                      )}
                      {userData?.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {userData.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/scoreboard"
                      className="flex items-center gap-2"
                    >
                      <Trophy className="h-4 w-4" />
                      Scoreboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex items-center gap-2 text-red-600"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/signin">
                <Button size="sm" variant="outline">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t py-4"
          >
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-foreground/80 hover:text-foreground transition-colors px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Debates
              </Link>
              <Link
                href="/scoreboard"
                className="text-foreground/80 hover:text-foreground transition-colors px-2 py-1 flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Trophy className="h-4 w-4" />
                Scoreboard
              </Link>
              {isAuthenticated && (
                <Link
                  href="/create-debate"
                  className="text-foreground/80 hover:text-foreground transition-colors px-2 py-1 flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Plus className="h-4 w-4" />
                  Create Debate
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
