"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { completeAuthRedirect } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/client";
import {
  signUpSchema,
  type SignUpInput,
} from "@/lib/validations/auth";

export function SignUpForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: SignUpInput) {
    setServerError(null);
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setServerError(error.message);
      return;
    }

    // If email confirmation is required, session may be null
    if (!data.session) {
      setServerError(
        "Check your email to confirm your account before signing in."
      );
      return;
    }

    await completeAuthRedirect();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-[13px] font-medium text-foreground"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            className="h-11 rounded-lg"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="mt-1 text-sm text-destructive" role="alert">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-[13px] font-medium text-foreground"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            className="h-11 rounded-lg"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="mt-1 text-sm text-destructive" role="alert">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1 block text-[13px] font-medium text-foreground"
          >
            Confirm password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            className="h-11 rounded-lg"
            {...form.register("confirmPassword")}
          />
          {form.formState.errors.confirmPassword && (
            <p className="mt-1 text-sm text-destructive" role="alert">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        {serverError && (
          <p className="text-sm text-destructive" role="alert">
            {serverError}
          </p>
        )}

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="mt-2 h-11 w-full rounded-lg text-[13px] font-medium"
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating account…
            </>
          ) : (
            "Sign Up"
          )}
        </Button>
      </form>

      <div className="flex items-center gap-4">
        <div className="h-px flex-grow bg-border" />
        <span className="shrink-0 text-[13px] font-medium text-muted-foreground">
          or continue with
        </span>
        <div className="h-px flex-grow bg-border" />
      </div>

      <OAuthButtons />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-primary hover:text-primary/80"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
