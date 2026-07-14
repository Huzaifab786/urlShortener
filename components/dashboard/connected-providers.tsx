import { Check, X } from "lucide-react";

import type { AccountProvider } from "@/lib/actions/settings";
import { cn } from "@/lib/utils";

export function ConnectedProviders({
  providers,
}: {
  providers: AccountProvider[];
}) {
  return (
    <ul className="divide-y divide-border rounded-lg border border-border">
      {providers.map((provider) => (
        <li
          key={provider.id}
          className="flex items-center justify-between gap-3 px-4 py-3"
        >
          <span className="text-sm font-medium text-foreground">
            {provider.label}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide",
              provider.connected
                ? "bg-emerald-50 text-emerald-700"
                : "bg-secondary text-muted-foreground"
            )}
          >
            {provider.connected ? (
              <>
                <Check className="size-3.5" />
                Connected
              </>
            ) : (
              <>
                <X className="size-3.5" />
                Not connected
              </>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}
