import { Link2 } from "lucide-react";

export function AuthBrandHeader({ subtitle }: { subtitle: string }) {
  return (
    <div className="mb-6 flex flex-col items-center">
      <div className="mb-2 flex size-12 items-center justify-center rounded-lg bg-primary">
        <Link2 className="size-7 text-primary-foreground" strokeWidth={2.5} />
      </div>
      <h1 className="text-2xl font-black tracking-tight text-primary">Snipp</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}
