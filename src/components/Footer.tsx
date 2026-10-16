import { Smartphone } from "lucide-react";
import Link from "next/link";

export default function Footer({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`px-4 pt-8 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center ${className}`}
    >
      <Link
        href="/add-me-as-an-app"
        className="inline-flex items-center gap-2 rounded-full bg-blue/10 px-4 py-2.5 text-sm font-semibold text-blue transition hover:bg-blue/15 active:scale-95"
      >
        <Smartphone className="size-4" />
        Add me as an app
      </Link>
      <p className="mx-auto mt-4 max-w-sm text-xs leading-relaxed text-muted">
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
      <nav className="mt-3 flex justify-center gap-4 text-xs text-muted">
        <Link href="/privacy" className="hover:text-text">
          Privacy &amp; terms
        </Link>
        <a
          href="https://github.com/charliertm/wetherspenny"
          className="hover:text-text"
        >
          Source code
        </a>
      </nav>
    </footer>
  );
}
