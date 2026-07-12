import type { Metadata } from "next";

import { AuthBrandHeader } from "@/components/auth/auth-brand-header";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Sign Up — Snipp",
};

export default function SignUpPage() {
  return (
    <>
      <AuthBrandHeader subtitle="Create your free account to save and track links." />
      <SignUpForm />
    </>
  );
}
