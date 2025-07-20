// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { motion } from "framer-motion";
// import { Chrome } from "lucide-react";
// import { getSession, signIn } from "next-auth/react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect } from "react";

// export default function SignInPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const callbackUrl = searchParams.get("callbackUrl") || "/";

//   useEffect(() => {
//     getSession().then((session) => {
//       if (session) {
//         router.push(callbackUrl);
//       }
//     });
//   }, [router, callbackUrl]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 px-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="w-full max-w-md"
//       >
//         <Card className="shadow-lg">
//           <CardHeader className="text-center">
//             <div className="mx-auto mb-4 h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-xl">DA</span>
//             </div>
//             <CardTitle className="text-2xl">Welcome to Debate Arena</CardTitle>
//             <CardDescription>
//               Sign in to join debates, share your opinions, and compete with
//               other debaters
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <Button
//               onClick={() => signIn("google", { callbackUrl })}
//               className="w-full gap-2 h-12"
//               size="lg"
//             >
//               <Chrome className="h-5 w-5" />
//               Continue with Google
//             </Button>

//             <div className="text-center text-sm text-muted-foreground">
//               By signing in, you agree to our Terms of Service and Privacy
//               Policy
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// }

"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    });
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <form
        onSubmit={handleCredentialsLogin}
        className="w-full max-w-sm space-y-4"
      >
        <input
          type="text"
          className="input"
          placeholder="Email or Username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
      <hr className="my-6 w-full max-w-xs" />
      <Button
        variant="outline"
        className="w-full max-w-xs"
        onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        Continue with Google
      </Button>
    </div>
  );
}
