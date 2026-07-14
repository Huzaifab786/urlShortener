"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Link2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createLink } from "@/lib/actions/links";
import { getSiteUrl } from "@/lib/dashboard/types";
import {
  createLinkSchema,
  type CreateLinkInput,
} from "@/lib/validations/links";

function siteHostPrefix() {
  return `${getSiteUrl().replace(/^https?:\/\//, "")}/`;
}

export function CreateLinkModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const form = useForm<CreateLinkInput>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: { url: "", customAlias: "", title: "" },
  });

  useEffect(() => {
    if (open) {
      form.reset({ url: "", customAlias: "", title: "" });
    }
  }, [open, form]);

  async function onSubmit(values: CreateLinkInput) {
    const response = await createLink({
      url: values.url,
      customAlias: values.customAlias?.trim() || undefined,
      title: values.title?.trim() || undefined,
    });

    if (!response.success) {
      if (response.fieldErrors?.url) {
        form.setError("url", { message: response.fieldErrors.url });
      }
      if (response.fieldErrors?.customAlias) {
        form.setError("customAlias", {
          message: response.fieldErrors.customAlias,
        });
      }
      if (response.fieldErrors?.title) {
        form.setError("title", { message: response.fieldErrors.title });
      }
      if (
        !response.fieldErrors?.url &&
        !response.fieldErrors?.customAlias &&
        !response.fieldErrors?.title
      ) {
        form.setError("url", { message: response.error });
      }
      return;
    }

    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[500px]">
        <DialogHeader className="border-b border-border bg-card px-6 py-4">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Create New Link
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6 px-6 py-6">
            <div className="space-y-1.5">
              <Label htmlFor="create-url" className="flex justify-between">
                Destination URL
                <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Link2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="create-url"
                  type="text"
                  inputMode="url"
                  placeholder="https://example.com/very-long-url-path"
                  className="h-11 rounded-lg pl-10"
                  {...form.register("url")}
                />
              </div>
              {form.formState.errors.url && (
                <p className="text-sm text-destructive" role="alert">
                  {form.formState.errors.url.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="create-alias">
                Custom Short Link{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (Optional)
                </span>
              </Label>
              <div className="flex overflow-hidden rounded-lg border border-input focus-within:ring-1 focus-within:ring-ring">
                <div className="flex items-center border-r border-input bg-secondary px-3 font-mono text-sm text-muted-foreground select-none">
                  {siteHostPrefix()}
                </div>
                <Input
                  id="create-alias"
                  type="text"
                  placeholder="my-campaign"
                  className="h-11 rounded-none border-0 font-mono shadow-none focus-visible:ring-0"
                  {...form.register("customAlias")}
                />
              </div>
              {form.formState.errors.customAlias ? (
                <p className="text-sm text-destructive" role="alert">
                  {form.formState.errors.customAlias.message}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Leave blank to generate a random code.
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="create-title">
                Link Title{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (Optional)
                </span>
              </Label>
              <Input
                id="create-title"
                type="text"
                placeholder="e.g. Summer Promo Campaign"
                className="h-11 rounded-lg"
                {...form.register("title")}
              />
              <p className="text-xs text-muted-foreground">
                For your own reference on the dashboard.
              </p>
              {form.formState.errors.title && (
                <p className="text-sm text-destructive" role="alert">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 border-t border-border bg-card px-6 py-4 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-lg"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-lg"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating…
                </>
              ) : (
                <>
                  Create Link
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
