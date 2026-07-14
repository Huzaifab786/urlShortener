"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteAccount } from "@/lib/actions/settings";
import {
  deleteAccountSchema,
  type DeleteAccountInput,
} from "@/lib/validations/settings";

export function DeleteAccountSection() {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<DeleteAccountInput>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { confirmation: "" },
  });

  async function onSubmit(values: DeleteAccountInput) {
    setServerError(null);
    const result = await deleteAccount(values);
    // redirect() on success throws; only handle explicit failures
    if (result && !result.success) {
      setServerError(result.error ?? "Unable to delete account");
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Permanently delete your account and all of your links. This cannot be
        undone.
      </p>

      <AlertDialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) {
            form.reset();
            setServerError(null);
          }
        }}
      >
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="rounded-lg">
            Delete account
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes your Snipp account and every link you own. Type{" "}
              <span className="font-mono font-semibold text-foreground">
                DELETE
              </span>{" "}
              to confirm.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                autoComplete="off"
                placeholder="DELETE"
                className="h-11 rounded-lg font-mono"
                {...form.register("confirmation")}
              />
              {form.formState.errors.confirmation && (
                <p className="mt-1 text-sm text-destructive" role="alert">
                  {form.formState.errors.confirmation.message}
                </p>
              )}
            </div>

            {serverError && (
              <p className="text-sm text-destructive" role="alert">
                {serverError}
              </p>
            )}

            <AlertDialogFooter>
              <AlertDialogCancel
                type="button"
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </AlertDialogCancel>
              <Button
                type="submit"
                variant="destructive"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Deleting…
                  </>
                ) : (
                  "Delete forever"
                )}
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
