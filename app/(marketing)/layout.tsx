import Link from "next/link";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div
        className="dot-bg dot-mask pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      />

      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-container-max items-center justify-between px-6">
          <Logo />
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild className="rounded-lg">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex flex-grow flex-col items-center justify-center px-4 py-12 md:px-6 md:py-16">
        {children}
      </main>

      <footer className="relative z-10 mt-auto border-t border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-container-max flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row md:px-6">
          <p className="text-sm font-semibold text-foreground">
            © {new Date().getFullYear()} Snipp
          </p>
          <nav className="flex items-center gap-6 text-[13px] font-medium text-muted-foreground">
            <span className="cursor-default">Privacy</span>
            <span className="cursor-default">Terms</span>
          </nav>
        </div>
      </footer>
    </div>
  );
}
