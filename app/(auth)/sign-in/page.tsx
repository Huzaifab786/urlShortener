import type { Metadata } from "next";

import { AuthBrandHeader } from "@/components/auth/auth-brand-header";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign In — Snipp",
};

export default function SignInPage() {
  return (
    <>
      <AuthBrandHeader subtitle="Welcome back. Please enter your details." />
      <SignInForm />
    </>
  );
}
