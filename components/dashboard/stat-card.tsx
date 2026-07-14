import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  className,
  valueClassName,
}: {
  label: string;
  value: string;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 shadow-sm",
        className
      )}
    >
      <div className="mb-1 text-[13px] font-medium text-muted-foreground">
        {label}
      </div>
      <div
        className={cn(
          "truncate font-mono text-2xl font-semibold tracking-tight text-foreground",
          valueClassName
        )}
      >
        {value}
      </div>
    </div>
  );
}
