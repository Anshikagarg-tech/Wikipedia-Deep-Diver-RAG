export default function ResultSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex gap-6 rounded-2xl border border-line bg-surface p-5 sm:p-7"
    >
      <div className="flex-1 space-y-3">
        <div className="shimmer h-6 w-2/5 rounded-md" />
        <div className="shimmer h-3.5 w-full rounded" />
        <div className="shimmer h-3.5 w-11/12 rounded" />
        <div className="shimmer h-3.5 w-3/4 rounded" />
        <div className="shimmer mt-5 h-4 w-36 rounded" />
      </div>
      <div className="shimmer size-20 shrink-0 rounded-xl sm:size-28" />
    </div>
  );
}
