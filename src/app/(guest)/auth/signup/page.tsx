import AuthSignUp from "@/components/auth/auth.signup";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Signup Page",
  description: "Signup",
};
const SignUpPage = () => {
  return <AuthSignUp></AuthSignUp>;
};

export default SignUpPage;
