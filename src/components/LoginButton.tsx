"use client";

import { signIn } from "next-auth/react";
import React from "react";

const LoginButton: React.FC = () => {
  return (
    <div>
      <button onClick={() => signIn()}>Login</button>
    </div>
  );
};

export default LoginButton;
