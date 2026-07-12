import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "text-xl font-black tracking-tight text-primary",
        className
      )}
    >
      Snipp
    </Link>
  );
}
