"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return <div role="alert" className="max-w-prose">
    <h2 className="text-xl font-semibold">Something went wrong</h2>
    <pre className="mt-2 text-sm whitespace-pre-wrap text-red-700">{error.message}</pre>
    <button className="mt-4 px-4 py-2 rounded bg-black text-white" onClick={reset}>Try again</button>
  </div>;
}