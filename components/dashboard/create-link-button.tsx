"use client";

import { Plus } from "lucide-react";

import { useCreateLinkModal } from "@/components/dashboard/create-link-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CreateLinkButton({
  className,
  label = "New Link",
  variant = "default",
  fullWidth,
}: {
  className?: string;
  label?: string;
  variant?: "default" | "outline";
  fullWidth?: boolean;
}) {
  const { openCreateLink } = useCreateLinkModal();

  return (
    <Button
      type="button"
      variant={variant}
      className={cn("rounded-lg", fullWidth && "w-full", className)}
      onClick={openCreateLink}
    >
      <Plus className="size-4" />
      {label}
    </Button>
  );
}
