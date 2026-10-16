import {
  ChevronLeft,
  Ellipsis,
  EllipsisVertical,
  Menu,
  Share,
  SquarePlus,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Add me as an app",
  description:
    "Add wetherspenny to your home screen so it's always a tap away.",
};

function Key({ children }: { children: React.ReactNode }) {
  return (
    <span className="mx-0.5 inline-flex translate-y-[-1px] items-center gap-1 rounded-lg bg-surface-2 px-1.5 py-0.5 align-middle text-sm font-semibold whitespace-nowrap">
      {children}
    </span>
  );
}

function Steps({
  title,
  subtitle,
  steps,
  note,
}: {
  title: string;
  subtitle: string;
  steps: React.ReactNode[];
  note?: React.ReactNode;
}) {
  return (
    <section className="animate-rise rounded-3xl bg-surface p-5 text-text shadow-lg shadow-black/10">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-sm text-muted">{subtitle}</p>
      <ol className="mt-4 space-y-3">
        {steps.map((step, index) => (
          <li key={index} className="flex gap-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-blue text-sm font-bold text-white">
              {index + 1}
            </span>
            <span className="pt-0.5 leading-relaxed">{step}</span>
          </li>
        ))}
      </ol>
      {note && <p className="mt-4 text-sm text-muted">{note}</p>}
    </section>
  );
}

export default function AddMeAsAnApp() {
  return (
    <>
      <div className="backdrop" aria-hidden />
      <main className="mx-auto w-full max-w-xl flex-1 text-white">
        <div className="flex items-center justify-between px-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
          <Link
            href="/"
            aria-label="Back home"
            className="grid size-10 place-items-center rounded-full transition hover:bg-white/15 active:scale-90"
          >
            <ChevronLeft className="size-6" />
          </Link>
          <Link href="/" aria-label="wetherspenny home" className="logo-white">
            <Logo className="h-5 w-auto" />
          </Link>
          <ThemeToggle className="hover:bg-white/15" />
        </div>

        <header className="animate-rise px-4 pt-6 pb-2">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Add me as an app
          </h1>
          <p className="mt-2 text-white/80">
            Put wetherspenny on your home screen and it opens full screen like a
            normal app, so the cheapest round is always one tap away. No app
            store needed.
          </p>
        </header>

        <div className="mt-6 space-y-4 px-4">
          <Steps
            title="iPhone & iPad"
            subtitle="Safari, Chrome or Edge"
            steps={[
              <>
                Open wetherspenny and tap{" "}
                <Key>
                  <Ellipsis className="size-4" /> More
                </Key>{" "}
                next to the address bar, then{" "}
                <Key>
                  <Share className="size-4" /> Share
                </Key>
                .
              </>,
              <>
                Scroll down and tap{" "}
                <Key>
                  <SquarePlus className="size-4" /> Add to Home Screen
                </Key>
                .
              </>,
              <>
                Leave <strong>Open as Web App</strong> switched on and tap{" "}
                <strong>Add</strong>.
              </>,
            ]}
            note={
              <>
                On iOS 18 or earlier, tap the{" "}
                <Share className="inline size-4 align-text-bottom" /> Share
                button in the toolbar instead, then Add to Home Screen.
              </>
            }
          />

          <Steps
            title="Android"
            subtitle="Chrome"
            steps={[
              <>
                Open wetherspenny and tap the{" "}
                <Key>
                  <EllipsisVertical className="size-4" /> menu
                </Key>{" "}
                in the top corner.
              </>,
              <>
                Tap <Key>Add to home screen</Key>, then choose{" "}
                <strong>Install</strong>.
              </>,
              <>
                Tap Install again to confirm. It&apos;ll appear with your apps.
              </>,
            ]}
            note={
              <>
                Using Samsung Internet? Tap{" "}
                <Menu className="inline size-4 align-text-bottom" /> menu, then{" "}
                <strong>Add page to</strong> and <strong>Home screen</strong>.
              </>
            }
          />
        </div>
      </main>
      <Footer className="mx-auto mt-8 w-full max-w-xl rounded-t-3xl bg-bg" />
    </>
  );
}
