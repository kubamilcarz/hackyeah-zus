import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-prose">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-neutral-600">
        Try the simulator or go back home.
      </p>
      <Link
        className="mt-4 inline-block px-4 py-2 rounded bg-black text-white"
        href="/"
      >
        Home
      </Link>
    </div>
  );
}
