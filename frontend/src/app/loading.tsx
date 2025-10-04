export default function Loading() {
  return <div role="status" aria-live="polite" className="animate-pulse">
    <div className="h-6 w-40 bg-neutral-200 rounded" />
    <div className="mt-4 h-32 bg-neutral-100 rounded" />
  </div>;
}