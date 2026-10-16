"use client";

import { RefreshCw } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({ retry }: { retry: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 text-center">
      <p className="text-5xl">🍺</p>
      <h1 className="mt-4 text-xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-muted">
        We couldn&apos;t reach the Wetherspoon app. It&apos;s probably
        temporary, so give it another go.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex h-11 items-center gap-2 rounded-2xl bg-blue px-5 font-semibold text-white transition active:scale-95"
        >
          <RefreshCw className="size-4" />
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-2xl bg-surface-2 px-5 font-semibold transition active:scale-95"
        >
          Pick another pub
        </Link>
      </div>
    </main>
  );
}
