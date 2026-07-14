"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { changePassword } from "@/lib/actions/settings";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/lib/validations/settings";

export function ChangePasswordForm({
  hasPasswordLogin,
}: {
  hasPasswordLogin: boolean;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ChangePasswordInput) {
    setServerError(null);
    setSuccess(false);

    if (hasPasswordLogin && !(values.currentPassword ?? "").trim()) {
      form.setError("currentPassword", {
        message: "Current password is required",
      });
      return;
    }

    const result = await changePassword(values);
    if (!result.success) {
      setServerError(result.error ?? "Unable to update password");
      return;
    }

    form.reset();
    setSuccess(true);
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {!hasPasswordLogin && (
        <p className="rounded-lg bg-secondary px-3 py-2 text-sm text-muted-foreground">
          You currently sign in with a social provider. Setting a password lets
          you also sign in with email.
        </p>
      )}

      {hasPasswordLogin && (
        <div>
          <label
            htmlFor="currentPassword"
            className="mb-1 block text-[13px] font-medium text-foreground"
          >
            Current password
          </label>
          <Input
            id="currentPassword"
            type="password"
            autoComplete="current-password"
            className="h-11 max-w-md rounded-lg"
            {...form.register("currentPassword")}
          />
          {form.formState.errors.currentPassword && (
            <p className="mt-1 text-sm text-destructive" role="alert">
              {form.formState.errors.currentPassword.message}
            </p>
          )}
        </div>
      )}

      <div>
        <label
          htmlFor="newPassword"
          className="mb-1 block text-[13px] font-medium text-foreground"
        >
          New password
        </label>
        <Input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          className="h-11 max-w-md rounded-lg"
          {...form.register("newPassword")}
        />
        {form.formState.errors.newPassword && (
          <p className="mt-1 text-sm text-destructive" role="alert">
            {form.formState.errors.newPassword.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1 block text-[13px] font-medium text-foreground"
        >
          Confirm new password
        </label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          className="h-11 max-w-md rounded-lg"
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

      {success && (
        <p
          className="inline-flex items-center gap-1.5 text-sm text-emerald-700"
          role="status"
        >
          <Check className="size-4" />
          Password updated.
        </p>
      )}

      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="rounded-lg"
      >
        {form.formState.isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Saving…
          </>
        ) : hasPasswordLogin ? (
          "Update password"
        ) : (
          "Set password"
        )}
      </Button>
    </form>
  );
}
