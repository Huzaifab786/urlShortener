export default function DashboardLoading() {
  return (
    <div className="mx-auto w-full max-w-container-max flex-1 animate-pulse px-4 py-6 md:px-6 md:py-8">
      <div className="mb-6 h-10 w-40 rounded-lg bg-secondary" />
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="h-24 rounded-xl bg-secondary" />
        <div className="h-24 rounded-xl bg-secondary" />
        <div className="h-24 rounded-xl bg-secondary" />
      </div>
      <div className="h-64 rounded-xl bg-secondary" />
    </div>
  );
}
