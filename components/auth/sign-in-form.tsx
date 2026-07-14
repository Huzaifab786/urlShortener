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
  clearPendingClaim,
  readPendingClaim,
} from "@/lib/utils/pending-claim";
import {
  signInSchema,
  type SignInInput,
} from "@/lib/validations/auth";

export function SignInForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: SignInInput) {
    setServerError(null);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setServerError(error.message);
      return;
    }

    const pending = readPendingClaim();
    clearPendingClaim();
    await completeAuthRedirect(pending);
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
            autoComplete="current-password"
            placeholder="••••••••"
            className="h-11 rounded-lg"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="mt-1 text-sm text-destructive" role="alert">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
            <input
              type="checkbox"
              className="size-4 rounded border-border text-primary focus:ring-primary"
            />
            Remember me
          </label>
          <span className="cursor-default text-[13px] font-medium text-primary/60">
            Forgot Password?
          </span>
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
              Signing in…
            </>
          ) : (
            "Sign In"
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
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-primary hover:text-primary/80"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
