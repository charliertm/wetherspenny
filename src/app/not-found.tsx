import Link from "next/link";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 text-center">
      <Logo className="w-48" />
      <h1 className="mt-8 text-xl font-bold">We couldn&apos;t find that pub</h1>
      <p className="mt-2 text-muted">
        It might have closed or moved. Try searching for it instead.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-11 items-center rounded-2xl bg-blue px-5 font-semibold text-white transition active:scale-95"
      >
        Find a pub
      </Link>
    </main>
  );
}
