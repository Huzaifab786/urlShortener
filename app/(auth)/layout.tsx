export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4 md:p-6">
      <main className="w-full max-w-[440px] rounded-xl border border-border bg-card p-6 shadow-md md:p-10">
        {children}
      </main>
    </div>
  );
}
