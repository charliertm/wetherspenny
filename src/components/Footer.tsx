import { Smartphone } from "lucide-react";
import Link from "next/link";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.1.9 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
    </svg>
  );
}

export default function Footer({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`px-4 pt-8 pb-[max(1.5rem,env(safe-area-inset-bottom))] ${className}`}
    >
      <nav className="flex flex-wrap items-center justify-center gap-2 text-sm font-semibold">
        <Link
          href="/add-me-as-an-app"
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-blue transition hover:bg-blue/10"
        >
          <Smartphone className="size-4" />
          Add me as an app
        </Link>
        <a
          href="https://github.com/charliertm/wetherspenny"
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-green transition hover:bg-green/10"
        >
          <GithubIcon className="size-4" />
          Source code
        </a>
      </nav>
      <p className="mx-auto mt-3 max-w-sm text-center text-xs leading-relaxed text-muted">
        Not affiliated with J D Wetherspoon. Prices come from the Wetherspoon
        app and may be out of date. Please{" "}
        <a
          href="https://www.drinkaware.co.uk"
          className="underline underline-offset-2 hover:text-text"
        >
          drink responsibly
        </a>
        .
      </p>
    </footer>
  );
}
