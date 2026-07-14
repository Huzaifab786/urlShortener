"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Link2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { LiveCounter } from "@/components/landing/live-counter";
import {
  ResultCard,
  type ShortenResult,
} from "@/components/landing/result-card";
import { TypingHeadline } from "@/components/landing/typing-headline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createLink } from "@/lib/actions/links";
import { getFaviconUrl, tryExtractDomain } from "@/lib/utils/favicon";
import { savePendingClaim } from "@/lib/utils/pending-claim";
import {
  createLinkSchema,
  type CreateLinkInput,
} from "@/lib/validations/links";

export function ShortenForm() {
  const [result, setResult] = useState<ShortenResult | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<CreateLinkInput>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: { url: "" },
    mode: "onSubmit",
  });

  const urlValue = form.watch("url");
  const domain = tryExtractDomain(urlValue ?? "");

  async function onSubmit(values: CreateLinkInput) {
    setServerError(null);
    const response = await createLink(values);

    if (!response.success) {
      if (response.fieldErrors?.url) {
        form.setError("url", { message: response.fieldErrors.url });
      }
      setServerError(response.error);
      return;
    }

    // Backup for claim-after-auth if the httpOnly cookie isn't available later
    savePendingClaim(response.shortCode);

    setResult({
      shortCode: response.shortCode,
      shortUrl: response.shortUrl,
      originalUrl: response.originalUrl,
    });
    form.reset({ url: "" });
  }

  function handleReset() {
    setResult(null);
    setServerError(null);
    form.reset({ url: "" });
  }

  if (result) {
    return <ResultCard result={result} onReset={handleReset} />;
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 text-center">
      <div className="space-y-2">
        <TypingHeadline />
        <p className="mx-auto max-w-xl text-base text-muted-foreground">
          The modern, minimal URL shortener for teams and individuals.
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative mx-auto mt-8 max-w-3xl"
      >
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-100 to-blue-200 opacity-30 blur transition duration-500 group-hover:opacity-50" />
        <div className="relative flex flex-col items-stretch gap-2 rounded-2xl bg-card p-2 shadow-xl focus-within:ring-2 focus-within:ring-primary sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-center">
            <div className="flex min-w-10 items-center justify-center pl-3 pr-1">
              {domain ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getFaviconUrl(domain)}
                  alt=""
                  className="size-6 rounded"
                  width={24}
                  height={24}
                />
              ) : (
                <Link2 className="size-5 text-muted-foreground" aria-hidden />
              )}
            </div>
            <Input
              {...form.register("url")}
              type="text"
              inputMode="url"
              placeholder="Paste your long URL here..."
              autoComplete="url"
              className="h-auto border-0 bg-transparent py-4 text-base shadow-none focus-visible:ring-0"
              aria-invalid={Boolean(form.formState.errors.url)}
            />
          </div>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="h-12 shrink-0 rounded-xl px-8 text-[13px] font-medium shadow-md active:scale-95"
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Shortening…
              </>
            ) : (
              "Shorten"
            )}
          </Button>
        </div>

        {(form.formState.errors.url || serverError) && (
          <p className="mt-3 text-left text-sm text-destructive" role="alert">
            {form.formState.errors.url?.message ?? serverError}
          </p>
        )}
      </form>

      <LiveCounter />
    </div>
  );
}
